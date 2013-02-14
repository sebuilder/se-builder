var videoPlayer = null;

_V_("video-tag").ready(function() {
  videoPlayer = this;
});

!function ($) {
  // watch demo
  var togglePopupButton = $("#watch-demo");
  var popup = $("#video-container");
  var closeButton = popup.find(".icon-remove");
  var toggle = function() {
    if(!popup.hasClass("hidden") && videoPlayer) {
      videoPlayer.pause();
    } else if(videoPlayer) {
      videoPlayer.play();
    }
    popup.toggleClass("hidden");
  };
  togglePopupButton.click(toggle);
  closeButton.click(toggle);
}(window.jQuery)
