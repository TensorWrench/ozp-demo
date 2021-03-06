$(document).ready(function() {
    var mode = ozpIwc.util.parseQueryParams().offline || false;
    if(mode === "false"){
        mode = false;
    }
    var map = new CustomMap("map",mode, 'tiles');


    //Create the IWC Client
    //Once the IWC client is connected configure it to map features.
    var client=new ozpIwc.Client({peerUrl: window.OzoneConfig.iwcUrl});
    client.connect().then(function(){

        var intents = client.intents();
        var data = client.data();

        var mappingIntent = function(event){
            // This intent is expected to receive a data.api resource name to be used.
            var resource = event.entity;

            // Gather the resource
            data.get(resource).then(function(resp){
                // If this resource isn't already mapped
                if(!map.locationData[resource]){
                    // Attempt to add the resource to the map as a marker
                    var id = map.addMarker(resp.entity,resource);

                    // If the marker was successfully created, watch the resource for further changes
                    if(typeof id !== "undefined") {
                        return data.watch(resource, function (event) {
                            var newValue = event.entity.newValue;
                            map.updateMarker(resource,newValue);
                        });
                    }
                }
            });
        };
        var removeAt = window.location.href.indexOf('/index.html');
        var newPath = window.location.href.substring(0,removeAt);

        intents.register("/json/coord/map",{
            contentType: "application/vnd.ozp-iwc-intent-handler-v1+json",
            entity: {
                icon : newPath + "/icon.png",
                label: "Location Viewer"
            }
        },mappingIntent);
    });
});


