let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajax({
       url:`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoicmlzaGlyYWoxOTc3IiwiYSI6ImNreTZwaXh4NDB4d24ycG80ZDdoOXRzZnkifQ.cNYlGADu8wEHXrOBs1Y1tg`,
       type: "GET",
       success: function(response){
        console.log(response)

        var images = {
            "turn_right": "ar_right.png",
            "turn_left": "ar_left.png",
            "slight_right": "ar_slight_right.png",
            "slight_left": "ar_slight_left.png", 
            "straight": "ar_straight.png"
        }
        var steps = response.routes[0].legs[0].steps

        for(var i =0; i<steps.lenght; i++){
            var image
            var distance = steps[i].distance
            var instructions = steps[i].maneuver.instruction

            if (instructions.includes('Turn right')){
                image ='turn_right'
            }else if (instructions.includes('Turn left')) {
                image ='turn_left'
            }
            if (i>0){
                $('#scene_container').append(
                    `
                    <a-entity gps-entity-place='latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}>
                        <a-image 
                        name='${instructions}' 
                        src='./assets/${images[image]}'
                        look-at='#step_${i-1}'
                        scale='5 5 5'
                        position='0 0 0'
                        id='step_${i}'></a-image>
                        <a-entity>
                        <a-text value='${instructions} (${distance}m)' hieght='50'></a-text>
                        </a-entity>
                    </a-entity>
                    `
                )

            }else{
                $('#scene_container').append(
                    `
                    <a-entity gps-entity-place='latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}>
                        <a-image 
                        name='${instructions}' 
                        src='./assets/ar_start.png'
                        look-at='#step_${i+1}'
                        scale='5 5 5'
                        position='0 0 0'
                        id='step_${i}'></a-image>
                        <a-entity>
                        <a-text value='${instructions} (${distance}m)' hieght='50'></a-text>
                        </a-entity>
                    </a-entity>
                    `
                ) 
            }
        }

       }
   })
}
