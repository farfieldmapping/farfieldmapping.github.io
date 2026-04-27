(function(){
    function ready(fn){ if(document.readyState==='complete'||document.readyState==='interactive') setTimeout(fn,0); else window.addEventListener('load',fn); }
    function buildPopupHtml(p){
        var plot = p.Plot;
        var name = ((p.FirstName||'') + ' ' + (p.LastName||'')).trim();
        //var html = '<div style="background-color: #ef4036;text-align:center;padding:6px 8px;border-bottom:1px solid #ef4036;font-weight:bold;font-size:16px;color: #ffffff">'+ fullName +'</div>';
        var html = '<div class="plot-popup" style="font-family:Arial, Helvetica, sans-serif; font-size:13px;padding-left:8px;padding-right:8px;padding-bottom:8px;"><table style="border-collapse:collapse;width:100%;cursor:text;">';
        html += '<tbody>';
        html += '<tr><td colspan="2" style="text-align:center;font-size:larger;color:#0f5fc5;">Deceased Info</td>'
        html += '<tr><td>Name</td><td>' + name + '</td></tr>';
        html += '<tr><td>Burial Date</td><td>' + (p.BurialDate || '') + '</td></tr>';
        html += '<tr><td>Burial Note</td><td>' + (p.BurialNote || '') + '</td></tr>';
        html += '<tr><td colspan="2" style="text-align:center;font-size:larger;color:#0f5fc5;">Deed Info</td>'
        html += '<tr><td>Grantee Last Name</td><td>' + (p.Grantee || '') + '</td></tr>';
        html += '<tr><td>Book</td><td>' + (p.Book || '') + '</td></tr>';
        html += '<tr><td>Page</td><td>' + (p.Page || '') + '</td></tr>';
        html += '<tr><td>Recording Date</td><td>' + (p.RecordingDate || '') + '</td></tr>';
        html += '<tr><td colspan="2" style="text-align:center;font-size:larger;color:#0f5fc5;">Notes</td>'
        html += '<tr><td colspan="2" style="font-weight:normal;border-bottom:none">' + (p.Notes1 || '') + '</td></tr>';
        html += '<tr><td colspan="2" style="font-weight:normal;border-bottom:none">' + (p.Notes2 || '') + '</td></tr>';
        html += '<tr><td colspan="2" style="font-weight:normal;border-bottom:none">' + (p.Notes3 || '') + '</td></tr>';
        html += '<tr><td colspan="2" style="font-weight:normal;border-bottom:none">' + (p.Notes4 || '') + '</td></tr>';
        html += '</tbody></table></div>';
        return html;
    }

    ready(function(){
        var container = document.querySelector('.plot-list');
        if (!container) return;
        var mapContainer = (window.map && map.getContainer) ? map.getContainer() : document.body;
        var popupDiv = document.createElement('div');
        popupDiv.id = 'plot-popup';
        popupDiv.style.position = 'absolute';
        popupDiv.style.zIndex = 10001;
        popupDiv.style.width = '400px';
        popupDiv.style.maxHeight = '50vh';
        //popupDiv.style.overflow = 'auto';
        popupDiv.style.background = '#f8f8f8';
        popupDiv.style.boxShadow = '0 3px 14px rgba(0,0,0,0.3)';
        popupDiv.style.display = 'none';
        popupDiv.style.padding = '0px';
        popupDiv.style.borderRadius = '4px';
        mapContainer.appendChild(popupDiv);

        function positionPopupDiv(){
            try{
                    popupDiv.style.top = 60 + '%';
                    popupDiv.style.left = 10 +'px'
                    popupDiv.style.bottom = 2 + '%'
                    popupDiv.style.maxHeight = '50vh';
                    popupDiv.style.overflow = 'auto';
                }
            catch(e){}
        }
        /*window.addEventListener('resize', positionPopupDiv);
        if (window.map && typeof map.on === 'function') map.on('move resize', positionPopupDiv);*/

        // highlighted plot helpers
        var highlightedPlotLayer = null;
        function clearPlotHighlight() {
            try {
                if (highlightedPlotLayer && window.layer_Plots_1 && typeof window.layer_Plots_1.resetStyle === 'function') {
                    window.layer_Plots_1.resetStyle(highlightedPlotLayer);
                } else if (highlightedPlotLayer && typeof highlightedPlotLayer.setStyle === 'function') {
                    // best-effort reset when resetStyle isn't available
                    highlightedPlotLayer.setStyle({
                        color: 'rgba(35,35,35,1.0)',
                        weight: 1,
                        fillColor: 'rgba(166,206,227,1.0)',
                        fillOpacity: 1
                    });
                }
            } catch (e) {}
            highlightedPlotLayer = null;
        }
        function highlightPlotById(plotId, panTo) {
            try {
                clearPlotHighlight();
                if (!plotId || !window.layer_Plots_1 || typeof window.layer_Plots_1.eachLayer !== 'function') return;
                var pid = '' + plotId;
                var found = null;
                window.layer_Plots_1.eachLayer(function(layer) {
                    var p = (layer && layer.feature && layer.feature.properties && layer.feature.properties.Plot) ? ('' + layer.feature.properties.Plot) : '';
                    if (p === pid) found = layer;
                });
                if (!found) return;
                if (typeof found.setStyle === 'function') {
                    found.setStyle({
                        color: 'rgba(255,165,0,1)',
                        weight: 4,
                        fillColor: 'rgba(255,255,0,0.45)',
                        fillOpacity: 1
                    });
                }
                if (typeof found.bringToFront === 'function') found.bringToFront();
                if (panTo && window.map && typeof window.map.fitBounds === 'function' && typeof found.getBounds === 'function') {
                    try { window.map.fitBounds(found.getBounds(), {padding:[20,20]}); } catch (e){}
                }
                /*if (window.map && typeof window.map.fitBounds === 'function') {
                    window.map.fitBounds(highlightedPlotLayer.getBounds(), {padding:[20,20]});
                }*/
                highlightedPlotLayer = found;
            } catch (e) {}
        }

        // intercept clicks on rows (capture phase) and show fixed popup
        container.addEventListener('click', function(e){
            var target = e.target || e.srcElement;
            var row = target.closest ? target.closest('tr[data-plot], tr[data-idx]') : null;
            if (!row) return;
            // stop other handlers (including original that opens leaflet popup)
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (e.preventDefault) e.preventDefault();

            var plot = row.getAttribute('data-plot');
            // clear any previous selection
            container.querySelectorAll('tr.selected').forEach(function(r){ r.classList.remove('selected'); });
            // mark this row selected
            row.classList.add('selected');
            var feat = null;
            if (plot && window.json_PlotTable_6 && Array.isArray(window.json_PlotTable_6.features)) {
                for (var i = 0; i < window.json_PlotTable_6.features.length; i++) {
                    var f = window.json_PlotTable_6.features[i];
                    var pid = (f && f.properties && f.properties.Plot) ? (f.properties.Plot + '') : '';
                    if (pid === plot) { feat = f; break; }
                }
            }
            if (!feat) {
                var idx = parseInt(row.getAttribute('data-idx'), 10);
                if (isNaN(idx)) return;
                feat = (window.json_PlotTable_6 && window.json_PlotTable_6.features && window.json_PlotTable_6.features[idx]) ? window.json_PlotTable_6.features[idx] : null;
            }
            var props = feat ? feat.properties || {} : {};
            var popupHtml = buildPopupHtml(props);
            var pl = props.Plot
            //var fullName = ((props.FirstName||'') + ' ' + (props.LastName||'')).trim();
            popupDiv.innerHTML = '<div style="position:sticky;top:0;background-color: #0f5fc5;text-align:left;padding:12px;border-bottom:1px solid #0f5fc5;font-weight:bold;font-size:16px;color: #ffffff;cursor:text;">'+ pl +'<button id="plot-popup-close" style="font-size:12px;margin-bottom:6px;padding:4px 8px;float:right;cursor:pointer;">Close</button></div>' + popupHtml;
            var closeBtn = popupDiv.querySelector('#plot-popup-close');
            if (closeBtn) closeBtn.addEventListener('click', function(){
                popupDiv.style.display = 'none';
                container.querySelectorAll('tr.selected').forEach(function(r){ r.classList.remove('selected'); });
                clearPlotHighlight();
            });
            popupDiv.style.display = 'block';
            positionPopupDiv();
            // highlight the corresponding plot on the map
            try { highlightPlotById(plot || props.Plot, false); } catch (e) {}
            if (L && L.DomEvent) {
                if (L.DomEvent.disableClickPropagation) L.DomEvent.disableClickPropagation(popupDiv);
                if (L.DomEvent.disableScrollPropagation) L.DomEvent.disableScrollPropagation(popupDiv);
            }
        }, true);

    });
})();
