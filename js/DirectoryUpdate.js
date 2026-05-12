(function(){
  const id = '1bk0suSSDMsWnlxiAss5xoSnFl-nfoqq-a3g6vdaVzbU';
  const gid = '1932469646';
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}`;

  fetch(url).then(r => r.text()).then(text => {
    const jsonText = text.match(/\{[\s\S]*\}/)[0];
    const obj = JSON.parse(jsonText);
    const cols = (obj.table.cols||[]).map(c => (c.label||c.id||'').trim().replace(/\s+/g,'_'));
    const rows = (obj.table.rows||[]).map(r => {
      const out = {};
      cols.forEach((col,i)=>{
        const cell = r.c && r.c[i];
        out[col] = cell == null ? null : (cell.f != null ? cell.f : cell.v);
      });
      return out;
    });

    const fc = { type: "FeatureCollection", name : "Plots", crs : { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } } , features: rows.map(r => ({ type: "Feature", properties: r })) };
    //var json_CemeteryDirectory_8 = document.getElementById('json').innerHTML = fc
    const content = 'var json_CemeteryDirectory = ' +  JSON.stringify(fc, null, 2) + ';';
    const blob = new Blob([content], { type: 'application/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'CemeteryDirectory.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }).catch(console.error);
})();
