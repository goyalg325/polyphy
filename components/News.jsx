import React from "react";
const News = () => {
return(
    <>
   <div className="news-wrapper">
      <h2>PolyPhy Updates</h2>
      <br />
      <a
          className="twitter-timeline"
          data-height="450"
          data-chrome="noscrollbar noheader transparent nofooter"
          data-theme="dark"
          data-tweet-limit="3"
          href="https://twitter.com/PolyPhyIO?ref_src=twsrc%5Etfw"
        >
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
      </>
      )
      };
      
export default News;