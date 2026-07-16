var json_PlotTable_6;

(function(){
  window.filterbyLot = function(lot){
    lot = lot ? lot.toString().toUpperCase() : '';
    var container = document.querySelector('.plot-list');
    if (!container) return;
    var rows = container.querySelectorAll('tr[data-lot], tr[data-idx]');
    rows.forEach(function(row){
      var l = '';
      if (row.getAttribute('data-lot')) l = row.getAttribute('data-lot');
      else {
        var td = row.querySelector('td:nth-child(1)');
        if (td) l = td.textContent || td.innerText || '';
      }
      l = l ? l.toString().toUpperCase() : '';
      if (!lot || l === lot) row.style.display = '';
      else row.style.display = 'none';
    });
  };

  window.clearLotFilter = function(){
    window.filterbyLot('');
  };

  /*
  // filter Plot list using the plot layer
  window.addEventListener('load', function(){
    try {
      if (window.layer_Plots_1 && typeof window.filterbyLot === 'function') {
        layer_Plots_1.on('click', function(e){
          try {
            if (e && e.originalEvent) {
              if (typeof L !== 'undefined' && L.DomEvent && typeof L.DomEvent.stopPropagation === 'function') {
                L.DomEvent.stopPropagation(e.originalEvent);
              } else if (e.originalEvent.stopPropagation) {
                e.originalEvent.stopPropagation();
              }
            }
          } catch (__){}
          var props = (e.layer && e.layer.feature && e.layer.feature.properties) || (e.feature && e.feature.properties) || {};
          var lotID = props['Lot'] || '';
          window.filterbyLot(lotID);
        });
      }
      // clear filter when clicking the map background (outside features)
      if (window.map && typeof window.clearLotFilter === 'function') {
        map.on('click', function(e){
          window.clearLotFilter();
        });
      }
    } catch (err) { console.error('Attach state click filter error', err); }
  });
  */

  // filter Plot list using the Lot layer
  window.addEventListener('load', function(){
    try {
      if (window.layer_LotLabels_2 && typeof window.filterbyLot === 'function') {
        layer_LotLabels_2.on('click', function(e){
          try {
            if (e && e.originalEvent) {
              if (typeof L !== 'undefined' && L.DomEvent && typeof L.DomEvent.stopPropagation === 'function') {
                L.DomEvent.stopPropagation(e.originalEvent);
              } else if (e.originalEvent.stopPropagation) {
                e.originalEvent.stopPropagation();
              }
            }
          } catch (__){}
          var props = (e.layer && e.layer.feature && e.layer.feature.properties) || (e.feature && e.feature.properties) || {};
          var lotID = props['Lot'] || '';
          window.filterbyLot(lotID);
        });
      }
      // clear filter when clicking the map background (outside features)
      if (window.map && typeof window.clearLotFilter === 'function') {
        map.on('click', function(e){
          window.clearLotFilter();
        });
      }
    } catch (err) { console.error('Attach state click filter error', err); }
  });
})();
