fetch('https://www.hebcal.com/converter?cfg=json&g2h=1')
.then(response => response.json())
.then(data => {
        document.getElementById('heb-date').innerHTML = data.hebrew;
    }
);