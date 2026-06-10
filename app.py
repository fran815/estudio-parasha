from flask import Flask, render_template
from tehilim import buscar_salmo

app = Flask(__name__)

get_daily_tehilim = buscar_salmo()
tehilim_number = get_daily_tehilim["nombre"]
tehilim_content = get_daily_tehilim["descripcion"]


@app.route('/')
def index():
    return render_template('index.html', te_number=tehilim_number,
                                        te_cont=tehilim_content)


if __name__ == '__main__':
    app.run(debug=True)