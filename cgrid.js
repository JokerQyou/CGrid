/**
 * Extra prototype applied to Array
 */

Array.prototype.delete = function(n){
    if(n < 0){
        return this;
    }
    this.splice(n, 1);
    return this;
}

function CGrid(){
    // Main canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'CGrid';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var context = canvas.getContext('2d');

    // Buffer canvas
    buffer = document.createElement('canvas');
    var bufferContext = buffer.getContext('2d');

    var particles = [];

    var loopId = null;
    var FPS = 30;

    var QUANTITY = 10 + Math.random() * 60 | 0;

    var colors = ['rgba(191, 51, 50, 0.77)', 'rgba(67, 191, 50, 0.77)', 'rgba(50, 152, 191, 0.77)', 'rgba(191, 191, 50, 0.77)'];

    var createParticles = function(){
        particles = [];

        for(var i = 0; i < QUANTITY; i ++){
            createParticle()
        }
    };

    var randomPosition = function(orientation){
        /**
         * Orientation spec:
         * 0: up;
         * 1: right;
         * 2: down;
         * 3: left;
         */
        switch(orientation){
            case 0:
                return {
                    x: Math.random() * window.innerWidth | 0, 
                    y: window.innerHeight - 5
                }
            break;

            case 1:
            return {
                x: 0 + 5,
                y: Math.random() * window.innerHeight | 0
            }
            break;

            case 2:
            return {
                x: Math.random() * window.innerWidth | 0,
                y: 0 + 5
            }
            break;

            case 3:
            return {
                x: window.innerWidth - 5,
                y: Math.random() * window.innerHeight | 0
            }
            break;
        }
    };

    var syncSize = function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        buffer.height = window.innerHeight;
        buffer.width = window.innerWidth;
    };

    var createParticle = function(){
        var particle = {
            size: 4 + Math.random() * 3 | 0, 
            orientation: Math.random() * 4 | 0, 
            speed: 2 + Math.random() * 6 | 0, 
            fillColor: colors[Math.random() * 4 | 0]
        }
        particle.position = randomPosition(particle.orientation);
        particles.push(particle);
    };

    var isVisible = function(particle){
        if((particle.position.x > window.innerWidth) || (particle.position.x < 0) || (particle.position.y < 0) || (particle.position.y > window.innerHeight)){
            return false;
        }
        return true;
    };

    var drawParticles = function(){
        for(var i = 0, len = particles.length; i < len; i++){
            var particle = particles[i];
            if(isVisible(particle)){
                bufferContext.fillStyle = particle.fillColor;
                bufferContext.shadowColor = particle.fillColor;
                bufferContext.shadowBlur = 20 - particle.size;
                bufferContext.lineWidth = particle.size;
                bufferContext.fillRect(particle.position.x, particle.position.y, particle.size, particle.size);
                switch(particle.orientation){
                    case 0:
                        particle.position.y -= particle.speed;
                    break;

                    case 1:
                        particle.position.x += particle.speed;
                    break;

                    case 2:
                        particle.position.y += particle.speed;
                    break;

                    case 3:
                        particle.position.x -= particle.speed;
                    break;
                }
            }else{
                particles.delete(i);
                createParticle();
            }
        }

        context.drawImage(buffer, 0, 0);
    };

    var drawFadeLayer = function(){
        // reset shadow to zero
        bufferContext.shadowBlur = 0;
        bufferContext.fillStyle = 'rgba(0, 0, 0, .1)';
        bufferContext.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(buffer, 0, 0);
    };

    var loop = function(){
        drawFadeLayer();
        drawParticles();
    };

    var init = function(){
        syncSize();
        createParticles();
        loopId = setInterval(loop, 1000 / FPS);
        window.addEventListener('resize', function(){
            syncSize();
        });
        canvas.addEventListener('click', function(e){
            // console.log(e);
            var tmpColors = colors.concat();
            for(var i = 3; i >= 0; i --){
                var color = Math.random()*(i+1) | 0;
                var particle = {
                    position: {x: e.offsetX || e.clientX, y: e.offsetY || e.clientY},
                    size: 4 + Math.random() * 3 | 0,
                    orientation: i,
                    speed: 2 + Math.random() * 6 | 0,
                    fillColor: tmpColors[color]
                };
                tmpColors.splice(color, 1);
                particles.shift();
                particles.push(particle);
            }
        });
    };

    init();
}
