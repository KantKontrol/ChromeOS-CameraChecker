let videoIsStream = false;

const EventType = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}


/*
  hit record on media recorder -> failed to execute start on media recorder error after hitting record 3 times
  credit text not styled well
  Fix close and clear memory?
*/

window.onload = function() {

    //Recording elements
    let recordVideoEL = document.getElementById('record-element');
    let startRecordButton = document.getElementById('start-recording');
    let stopRecordButton = document.getElementById('stop-recording');
    startRecordButton.disabled = true;
    stopRecordButton.disabled = true;

    let playbackVideoEL = document.getElementById('playback-element');

    let eventLog = document.getElementById('event-log');
    //==========================================

    let userStream = null;
    let mediaRecorder = null;
    let chunks = [];

    const init = () => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          }).then(stream => {
            userStream = stream;
            if(userStream){
                startRecordButton.disabled = false;
                recordVideoEL.srcObject = userStream;
                mediaRecorder = new MediaRecorder(userStream);
                setupMediaRecorderListeners();
            }
          })
          .catch(e => {
              logEvent(EventType.ERROR, "Error loading camera stream");
          });
    }

    const logEvent = (type, eventStatus) => {
        let newEventEl = document.createElement('div');
        newEventEl.className = 'event';

        if(type === EventType.SUCCESS){
           newEventEl.style.color = 'rgb(34, 185, 92)';
        }
        else if(type === EventType.ERROR){
            newEventEl.style.color = 'rgb(247, 0, 0)';
        }

        newEventEl.innerHTML = eventStatus || "";

        eventLog.appendChild(newEventEl);
    }


    startRecordButton.addEventListener("click", function() {
      if(userStream){
        startRecordButton.disabled = true;
        stopRecordButton.disabled = false;
        chunks = [];
         mediaRecorder.start();
      }
    });

    setupMediaRecorderListeners = function(){
      mediaRecorder.ondataavailable = ({data}) => chunks.push(data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 'type' : 'video/mp4' });
        chunks = [];
        playbackVideoEL.src = window.URL.createObjectURL(blob);
      }
    }

    stopRecordButton.addEventListener('click', () => {
      mediaRecorder.stop();
      startRecordButton.disabled = false;
      stopRecordButton.disabled = true;
    });

     document.querySelector('#reset').onclick = function() {
      if(userStream !== null){
        const tracks = userStream.getTracks();
      
        tracks.forEach(function(track) {
          track.stop();
        });
      
        recordVideoEL.srcObject = null; 
      }
        window.close();
     };


     init();
}
