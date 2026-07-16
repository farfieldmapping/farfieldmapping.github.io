  L.Control.Watermark = L.Control.extend({
                onAdd: function(map) {
        // Create an image element
            var div = L.DomUtil.create('div'); 
            var a = L.DomUtil.create('a', '', div);
            var img = L.DomUtil.create('img', '', a);

        // Set the source and style properties
            div.style.height = '52px'; // Adjust the size as needed
            a.href = 'http://farfieldmapping.com'; // Optional: Set a link for the logo
            a.target = '_blank'; // Optional: Open the link in a new tab
            img.src = 'https://farfieldmapping.wordpress.com/wp-content/uploads/2024/01/ffm_logo_crop-2.png'; // Replace with your image path or URL
            img.style.height = '52px';      // Adjust the size as needed

        // Optional: Add a link wrapper if the logo should be clickable
        // You would need a slightly different implementation for this, 
        // e.g., using a container div and an anchor tag inside it.

        return div;
        },
        onRemove: function(map) {
        // Nothing to do here for a simple image control
         }
         });
// 2. Create a factory function for convenience
        L.control.watermark = function(opts) {
           return new L.Control.Watermark(opts);
        }

// 3. Add the logo to the map
        L.control.watermark({
          position: 'bottomright' // Choose your desired position
            }).addTo(map);