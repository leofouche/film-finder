import dash
from dash import dcc, html, Input, Output, callback, dash_table
import dash_bootstrap_components as dbc
from dash.dash_table.Format import Format
import datetime


import polars as pl
from polars import col as c

from utils import get_au_streaming_offers_for_film

# Init app with dark theme
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.DARKLY])
server = app.server
app.title = "Film Finder"

# Load data
PROCESSED_PATH = "/data/processed/clean.csv"
films = (
    pl.read_csv(PROCESSED_PATH)
    .filter(c("primaryTitle") == c("originalTitle"))
    .rename(
        {
            "primaryTitle": "Title",
            "averageRating": "IMDB Rating",
            "numVotes": "Number Reviews",
            "startYear": "Year",
            "runtimeMinutes": "Length (mins)",
            "genres": "Genres",
            "primaryName": "Director",
        }
    )
    .select(
        [
            "Title",
            "IMDB Rating",
            "Number Reviews",
            "Year",
            "Length (mins)",
            "Genres",
            "Director",
        ]
    )
    .sort("Number Reviews", descending=True)
)


def table_formatting_list(columns):
    return [
        (
            {"name": i, "id": i, "deletable": True, "selectable": True}
            if i != "Number Reviews"
            else {
                "name": i,
                "id": i,
                "deletable": True,
                "selectable": True,
                "type": "numeric",
                "format": Format().group(True),
            }
        )
        for i in columns
    ]


def get_genre_tokens():
    return (
        films.select("Genres")
        .with_columns(c("Genres").str.split(",").alias("Genres"))
        .explode("Genres")
        .group_by("Genres")
        .len()
        .sort("len", descending=True)
        .select("Genres")
        .to_series()
        .to_list()
    )


def table_row_formatting():
    return [
        {
            "if": {
                "filter_query": "{Number Reviews} > 100000 && {IMDB Rating} >= 7",
                "column_id": "Title",
            },
            "backgroundColor": "#0d6efd",
            "color": "white",
        }
    ]


genre_tabs = get_genre_tokens()

app.layout = dbc.Container(
    [
        html.H1("🎬 Film Finder", className="text-center my-4"),
        dcc.Input(
            id="search-bar",
            type="text",
            placeholder="🔍 Search for a film by title...",
            debounce=True,
            style={
                "width": "100%",
                "padding": "12px",
                "fontSize": "18px",
                "backgroundColor": "#343a40",
                "color": "white",
                "border": "1px solid #6c757d",
                "borderRadius": "6px",
                "marginBottom": "20px",
            },
        ),
        dbc.Tabs(
            id="genre-tabs",
            active_tab=genre_tabs[0],
            children=[dbc.Tab(label=genre, tab_id=genre) for genre in genre_tabs],
            className="mb-3",
        ),
        dbc.Row(
            [
                dbc.Col(
                    dcc.RangeSlider(
                        id="year-slider",
                        min=films["Year"].min(),
                        max=films["Year"].max(),
                        value=[films["Year"].min(), films["Year"].max()],
                        marks={year: str(year) for year in range(1950, 2030, 10)},
                        step=1,
                        tooltip={"always_visible": False},
                        className="mt-2",
                    ),
                    width=12,
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    dcc.Checklist(
                        id="quick-filters",
                        options=["Top Rated", "Popular", "Short", "Recent"],
                        value=[],
                        inline=True,
                        inputStyle={"margin-right": "5px", "margin-left": "15px"},
                        style={
                            "marginTop": "10px",
                            "marginBottom": "20px",
                            "color": "white",
                        },
                    )
                )
            ]
        ),
        dash_table.DataTable(
            id="table",
            columns=table_formatting_list(films.columns),
            data=films.to_dicts(),
            filter_action="native",
            sort_action="native",
            sort_mode="multi",
            row_selectable="single",
            selected_rows=[],
            page_action="native",
            page_current=0,
            page_size=10,
            style_data={
                "whiteSpace": "normal",
                "height": "auto",
                "color": "white",
                "backgroundColor": "#343a40",
            },
            style_header={"backgroundColor": "#212529", "color": "white"},
            style_table={"overflowX": "auto"},
            style_data_conditional=table_row_formatting(),
        ),
        html.Hr(),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.H4(id="streaming-services", className="text-center"),
                        html.Div(id="streaming-logos", style={"textAlign": "center"}),
                    ],
                    width=3,
                ),
                dbc.Col(
                    [
                        html.H4(id="director-title", className="text-center"),
                        dash_table.DataTable(
                            id="director-table",
                            columns=table_formatting_list(
                                films.drop("Director").columns
                            ),
                            style_data={
                                "whiteSpace": "normal",
                                "height": "auto",
                                "color": "white",
                                "backgroundColor": "#343a40",
                            },
                            style_table={"overflowX": "auto"},
                            sort_action="native",
                            style_data_conditional=table_row_formatting(),
                        ),
                    ],
                    width=9,
                ),
            ]
        ),
    ],
    fluid=True,
)


@callback(
    Output("table", "data"),
    [
        Input("year-slider", "value"),
        Input("genre-tabs", "active_tab"),
        Input("quick-filters", "value"),
        Input("search-bar", "value"),
    ],
)
def filter_table(year_range, genre, filters, search_value):
    df = films.filter((c("Year") >= year_range[0]) & (c("Year") <= year_range[1]))

    current_year = datetime.datetime.now().year

    if "Recent" in filters:
        df = df.filter(c("Year") >= current_year - 2)

    if genre:
        df = df.filter(c("Genres").str.contains(genre))
    if search_value:
        df = df.filter(
            c("Title")
            .str.to_lowercase()
            .str.contains(search_value.lower(), literal=True)
        )
    if "Top Rated" in filters:
        df = df.filter(c("IMDB Rating") >= 7)
    if "Popular" in filters:
        df = df.filter(c("Number Reviews") >= 100000)
    if "Short" in filters:
        df = df.filter(c("Length (mins)") <= 120)
    return df.to_dicts()


@callback(
    [Output("streaming-services", "children"), Output("streaming-logos", "children")],
    [
        Input("table", "derived_virtual_data"),
        Input("table", "derived_virtual_selected_rows"),
    ],
)
def update_streaming(rows, selected_rows):
    if not selected_rows:
        return "No film selected.", []
    title = rows[selected_rows[0]]["Title"]
    offers = get_au_streaming_offers_for_film(title)
    if not offers:
        return f'No subscription-streaming offers found in AU for "{title}".', []
    service_names = [o.service_name for o in offers]
    text = f"Available in Australia on: {', '.join(service_names)}"
    logos = [
        html.A(
            html.Img(
                src=o.icon_url,
                alt=o.service_name,
                title=o.service_name,
                style={"height": "50px", "margin": "0 8px"},
            ),
            href=o.offer_url,
            target="_blank",
        )
        for o in offers
    ]
    return text, logos


@callback(
    [Output("director-title", "children"), Output("director-table", "data")],
    [
        Input("table", "derived_virtual_data"),
        Input("table", "derived_virtual_selected_rows"),
    ],
)
def update_director_table(rows, selected_rows):
    if not selected_rows:
        return "No director selected.", None
    director = rows[selected_rows[0]]["Director"]
    text = f"Films by {director}"
    data = (
        films.filter(c("Director") == director).drop("Director").sort("Year").to_dicts()
    )
    return text, data


if __name__ == "__main__":
    app.run(debug=True)
