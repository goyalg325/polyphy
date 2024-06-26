'use client'
import React, { useState } from "react";
import { Grid, Link } from "@mui/material";
import dynamic from 'next/dynamic';

const Hero = ({ data }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const DynamicVideo = dynamic(
    () =>
      import('./VideoComponent').then((mod) => {
        handleVideoLoad();
        return mod.VideoComponent;
      }),
    { ssr: false }
  );

  return (
    <>
      <div className="hero">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <div className="content">
              <h1>PolyPhy</h1>
              <div className="headingUnderline"></div>
              {data?.length > 0 ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: data[0]?.Home.replaceAll("\n", "<br />"),
                  }}
                ></p>
              ) : (
                <p>
                  Structural Analysis of Cosmological Datasets via Interactive
                  Physarum Polycephalum Visualisation.
                  <br />
                  <br />
                  PolyPhy is an interactive tool to analyze intergalactic gas
                  and dark matter filaments (together known as 'Cosmic web')
                  using the Monte Carlo Physarum Machine (MCPM) algorithm
                  inspired by the foraging behavior of Physarum polycephalum
                  'slime mold'
                </p>
              )}

              <a href={process.env.NEXT_PUBLIC_URL + "#about"}>Get Started {">"}</a>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <div style={{ maxWidth: "600px" }}>
              {!isVideoLoaded && (
                <div style={{ width: '100%', height: 'auto', backgroundColor: 'black' }}></div>
              )}
              <DynamicVideo />
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="ctaArrowWrapper">
        <Link href={process.env.NEXT_PUBLIC_URL + "#about"} underline="none">
          <div className="ctaArrow"></div>
        </Link>
      </div>
    </>
  );
};

export default Hero;
