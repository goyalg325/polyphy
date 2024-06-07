import React from 'react';
import video from "../public/hero-video.webm";
// import '@/styles/index.scss';
import videoPoster from "@/public/video_poster.png"
export const VideoComponent = () => (
  <video
    className= "video"
    src={video}
    width="100%"
    height="auto"
    autoPlay
    loop
    muted
    poster={videoPoster}
  >
    <p>
      Your browser doesn't support HTML5 video. Here is a{" "}
      <a href={video}>link to the video</a> instead.
    </p>
  </video>
);
