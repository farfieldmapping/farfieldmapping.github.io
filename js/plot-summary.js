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
    var mapContainer = (window.map && map.getContainer) ? map.getContainer() : document.body;
    container.id = 'plot-summary';
    container.className = 'plot-summary info';
    container.style.zIndex = 10001;
    //container.style.maxHeight = '40vh';
    container.style.overflow = 'hidden';
    container.style.padding = '0px';
    container.style.width = '150px';
    container.style.position = 'absolute';
   // container.style.bottom = '0vh';
   container.style.display = 'block'
    mapContainer.appendChild(container);
    function positionPopupDiv(){
                try{
                        container.style.top = 35 + '%';
                        container.style.right = 10 +'px'
                        //container.style.bottom = 35 + '%'
                        container.style.maxHeight = '30vh';
                        container.style.overflow = 'hidden';
                    }
                catch(e){}
    }
    positionPopupDiv()

    var html = '<div style="padding: 8px;display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;background:#0f5fc5;">' +
               '<h3 style="margin:0;color:#ffffff;">Summary</h3>' +
               '</div>';

    html += '<div id="summary-div" style="padding-left:2px;padding-right:2px;padding-bottom:8px;">'
    var arr = [];
    listItems.forEach(function(item, idx) {
        var p = item.props;
        var LotAttr = p.Lot ? ' data-lot="' + (p.Lot + '') + '"' : '';
        var PlotAttr = p.Plot ? ' data-plot="' + (p.Plot + '') + '"' : '';
        var name = ((p.FirstName||'') + ' ' + (p.LastName||'')).trim();
        var interred = (name && p.Grantee) || (name && !p.Grantee && name !=='open');
        var reserved = !name && p.Grantee;
        var available = (!name && !p.Grantee) || (name ==='open' && !p.Grantee);
        var status = interred ? 'Interred' : reserved ? 'Reserved' : available ? 'Available' : '';
        arr.push(status);
    });
    var plotCount = arr.length;
    var interredCount = arr.filter(function(status){
        if (status === 'Interred')
            return 'Interred'
    }).length
    var reservedCount = arr.filter(function(status){
        if (status === 'Reserved')
            return 'Reserved'
    }).length
    var availableCount = arr.filter(function(status){
        if (status === 'Available')
            return 'Available'
    }).length
    html += '<p style="padding-left:0px;">Total Plots: <b>'+plotCount+
    '</b><p><button class="button button1"></button>Interred: <b>'+interredCount+
    '</b></p><p><button class="button button2"></button>Reserved: <b>'+reservedCount+
    '</b></p><p><button class="button button3"></button>Available: <b>' +availableCount+
    '</b></p></div></tbody></table>';
    container.innerHTML = html;

      /*function addToMap() {
        if (window.map && window.L && L.Control) {
            var ctrl = L.control({ position: 'topright' });
            ctrl.onAdd = function() { return container; };
            ctrl.addTo(map);
            // prevent clicks/scrolls inside this control from propagating to the map
            if (L && L.DomEvent) {
                if (L.DomEvent.disableClickPropagation) L.DomEvent.disableClickPropagation(container);
                if (L.DomEvent.disableScrollPropagation) L.DomEvent.disableScrollPropagation(container);
            }
            
        }
    }*/

    if (document.readyState === 'complete' || document.readyState === 'interactive') addToMap();
    else window.addEventListener('load', addToMap);

})();
