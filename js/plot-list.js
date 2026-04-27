(function() {
    if (!window.json_PlotTable_6) return;
    var features = json_PlotTable_6.features || [];

    var listItems = features.map(function(f) { return { props: f.properties || {}, geom: f.geometry || null }; });
    listItems.sort(function(a, b) {
        var la = (a.props.Plot || '').toString();
        var lb = (b.props.Plot || '').toString();
        return la.localeCompare(lb);
    });

    var container = document.createElement('div');
    container.id = 'plot-list';
    container.className = 'plot-list info';
    //container.style.maxHeight = '40vh';
    container.style.overflow = 'hidden';
    container.style.padding = '0px';
    container.style.width = '400px';
   // container.style.bottom = '0vh';

    var html = '<div style="padding: 8px;display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;background:#0f5fc5;">' +
               '<h3 style="margin:0;color:#ffffff;">Plots</h3>' +
               '<button id="clear-lot-filter" style="margin-left:8px;padding:4px 8px;font-size:12px;cursor:pointer;">Clear</button>' +
               '</div>';
    html += '<input type="text" id="myInput" placeholder="Search for plots, grantees, and deceased.." title="Type in a name">';

    html += '<div id="plot-div" style="padding-left:8px;padding-right:8px;padding-bottom:8px;">' + 
            '<table id="plot-table" style="border-collapse:collapse;width:100%;">';
    html += '<thead><tr class="header" style="color:#0f5fc5;">'+
    '<th style="text-align:left;">Plot</th>'+
    '<th style="text-align:left;">Grantee</th>'+ 
    '<th style="text-align:left;">Status</th>'+
    '<th style="text-align:left;">Deceased</th></tr></thead><tbody>';
    listItems.forEach(function(item, idx) {
        var p = item.props;
        var LotAttr = p.Lot ? ' data-lot="' + (p.Lot + '') + '"' : '';
        var PlotAttr = p.Plot ? ' data-plot="' + (p.Plot + '') + '"' : '';
        var name = ((p.FirstName||'') + ' ' + (p.LastName||'')).trim();
        html += '<tr data-idx="' + idx + '"' + LotAttr + PlotAttr + ' style="cursor:pointer;">' +
        '<td style="padding:6px 6px;width:15%;">' + (p.Plot || '') + '</td>' +
        '<td style="padding:4px 6px;width:25%;">' + (p.Grantee || '') + '</td>'
        if (name && p.Grantee) html += '<td style="padding:4px 6px;width:25%;">' + ('Interred' || '')
        else if (name && !p.Grantee && name !== 'open') html += '<td style="padding:4px 6px;width:25%;">' + ('Interred' || '')
        else if (!name && p.Grantee) html += '<td style="padding:4px 6px;width:25%;">' + ('Reserved' || '')
        else if (!name && !p.Grantee) html += '<td style="padding:4px 6px;width:25%;">' + ('Available' || '')
        else if (name ==='open' && !p.Grantee) html += '<td style="padding:4px 6px;width:25%;">' + ('Available' || '')
          html += '<td style="padding:4px 6px;">' + (name || '') + '</td>'
          '</tr></div>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    //search filter
    var _input = container.querySelector('#myInput');
    if (_input) {
    _input.addEventListener('input', function () {
    var filter = (_input.value || '').toUpperCase();
    var table = container.querySelector('#plot-table');
    if (!table) return;
    var tr = table.getElementsByTagName('tr');
    for (var i = 0; i < tr.length; i++) {
      var tds = tr[i].querySelectorAll('td:nth-child(1), td:nth-child(2), td:nth-child(4)'); // search in Plot, Grantee, and Deceased columns
      var rowText = '';
      for (var j = 0; j < tds.length; j++) rowText += (tds[j].textContent || tds[j].innerText) + ' ';
      tr[i].style.display = rowText.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    }
    });
}
    try {
        var _btn = container.querySelector('#clear-lot-filter');
        if (_btn) _btn.addEventListener('click', function(){ if (window.clearLotFilter) window.clearLotFilter(); });
    } catch (e) { }

    function addToMap() {
        if (window.map && window.L && L.Control) {
            var ctrl = L.control({ position: 'topleft' });
            ctrl.onAdd = function() { return container; };
            ctrl.addTo(map);
            // prevent clicks/scrolls inside this control from propagating to the map
            if (L && L.DomEvent) {
                if (L.DomEvent.disableClickPropagation) L.DomEvent.disableClickPropagation(container);
                if (L.DomEvent.disableScrollPropagation) L.DomEvent.disableScrollPropagation(container);
            }
            
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') addToMap();
    else window.addEventListener('load', addToMap);

})();



//Ensure each alumni row has a data-state attribute for filtering
/*
(function(){
  function ensureDataPlot(){
    var container = document.querySelector('.plot-list');
    if (!container) return;
        container.querySelectorAll('tr[data-plot], tr[data-idx]').forEach(function(row){
      if (!row.getAttribute('data-plot')){
        var td = row.querySelector('td:nth-child(1)');
        var pl = td ? (td.textContent || td.innerText || '') : '';
        row.setAttribute('data-plot', (pl || '').toString().trim());
      }
    });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(ensureDataPlot, 0);
  else window.addEventListener('load', ensureDataPlot);
})();
*/
//Ensure each alumni row has a data-country attribute for filtering
/*(function(){
  function ensureDataCountry(){
    var container2 = document.querySelector('.alumni-list');
    if (!container2) return;
        container2.querySelectorAll('tr[data-alumniid], tr[data-idx]').forEach(function(row){
      if (!row.getAttribute('data-country')){
        var td = row.querySelector('td:nth-child(3)');
        var c = td ? (td.textContent || td.innerText || '') : '';
        row.setAttribute('data-country', (c || '').toString().trim());
      }
    });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(ensureDataCountry, 0);
  else window.addEventListener('load', ensureDataCountry);

})();*/