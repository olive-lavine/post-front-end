"use client";

import React, { useState, useEffect, useRef } from "react";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { FeatureCollection, MultiLineString, Geometry } from "geojson";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import colors from "@/styles/colors";
import { useTheme } from "next-themes";
import map_loading from "@/public/map_loading.jpg";
import Image from "next/image";

interface MapProps {
  data: {
    land: FeatureCollection<Geometry>;
    interiors: MultiLineString;
  };
  availableStates: { [key: string]: string };
}

const projection = geoAlbersUsa();
const path = geoPath(projection);

export const Map = ({ data, availableStates }: MapProps) => {
  const northeastStates = [
    "New Hampshire",
    "Massachusetts",
    "Rhode Island",
    "New Jersey",
    "District of Columbia",
    "Delaware",
  ];
  const excludedStates = [
    "District of Columbia",
    "Commonwealth of the Northern Mariana Islands",
    "United States Virgin Islands",
    "American Samoa",
    "Guam",
    "Puerto Rico",
  ];

  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [loading, setLoading] = useState(true);
  // const [selectedState, setSelectedState] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const themeColors = colors[resolvedTheme || "light"];

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Create svg element
    const svg = d3.select(svgRef.current);

    // Create tooltip background and text
    const tooltipBg = svg
      .append("rect")
      .attr("class", "tooltip-bg")
      .attr("fill", "rgba(255, 255, 255, 0.8)")
      .attr("stroke", "black")
      .style("visibility", "hidden");

    const tooltip = svg
      .append("text")
      .attr("class", "tooltip")
      .attr("fill", "black")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

    // Draw map
    svg
      .selectAll(".land")
      .data(data.land.features)
      .join("path")
      .attr("class", "land")
      .attr("d", (feature) => path(feature)!)
      .attr("fill", (feature) =>
        availableStates[feature.properties?.name]
          ? themeColors.stateWithData
          : themeColors.defaultStateFill
      )
      .attr("stroke", themeColors.stateBorder)
      .attr("stroke-width", "1")
      .on("mouseover", (event, feature) => {
        const [mx, my] = d3.pointer(event);
        tooltip
          .attr("x", mx + 20)
          .attr("y", my + 20)
          .text(feature.properties?.name)
          .style("visibility", "visible");

        const tooltipNode = tooltip.node();
        if (tooltipNode) {
          const bbox = tooltipNode.getBBox();
          tooltipBg
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 5)
            .style("visibility", "visible");
        }

        if (availableStates[feature.properties?.name]) {
          d3.select(event.target).attr("fill", themeColors.hoverState);
        }
      })
      .on("mouseout", (event, feature) => {
        tooltip.style("visibility", "hidden");
        tooltipBg.style("visibility", "hidden");
        if (availableStates[feature.properties?.name]) {
          d3.select(event.target).attr("fill", themeColors.stateWithData);
        }
      })
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event);

        tooltip.attr("x", mx + 20).attr("y", my + 20);

        const tooltipNode = tooltip.node();
        if (tooltipNode) {
          const bbox = tooltipNode.getBBox();
          tooltipBg
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 10);
        }
      })
      .on("click", (event, feature) => {
        const stateName = feature.properties?.name;
        // setSelectedState(selectedState === stateName ? "" : stateName);
        if (stateName && availableStates[stateName]) {
          router.push("/states/" + availableStates[stateName]);
        }
      })
      .transition();

    svg
      .selectAll(".interiors")
      .data([data.interiors])
      .join("path")
      .attr("class", "interiors")
      .attr("d", path)
      .attr("fill", "none");

    svg
      .selectAll(".state-label")
      .data(data.land.features)
      .enter()
      .filter((d) => !excludedStates.includes(d.properties?.name)) // Exclude DC
      .append("text")
      .attr("class", "state-label")
      .attr("x", (d) => {
        const [cx, cy] = path.centroid(d);
        if (northeastStates.includes(d.properties?.name)) {
          return cx + 40; // Offset the label x position for northeast states
        }
        return cx; // Normal position for other states
      })
      .attr("y", (d) => {
        const [cx, cy] = path.centroid(d);
        if (northeastStates.includes(d.properties?.name)) {
          return cy - 20; // Offset the label y position for northeast states
        }
        return cy; // Normal position for other states
      })
      .attr("text-anchor", (d) =>
        northeastStates.includes(d.properties?.name) ? "start" : "middle"
      )
      .attr("dy", ".35em") // Adjust vertically
      .attr("font-size", "8pt")
      .attr("fill", themeColors.labelText)
      .text((d) => d.properties?.name);

    // Add lines connecting labels to states for northeast states, excluding DC
    svg
      .selectAll(".state-line")
      .data(data.land.features)
      .enter()
      .filter(
        (d) =>
          northeastStates.includes(d.properties?.name) &&
          !excludedStates.includes(d.properties?.name)
      )
      .append("line")
      .attr("class", "state-line")
      .attr("x1", (d) => path.centroid(d)[0]) // Starting point of the line at state centroid
      .attr("y1", (d) => path.centroid(d)[1])
      .attr("x2", (d) => path.centroid(d)[0] + 40) // Line end point offset for label
      .attr("y2", (d) => path.centroid(d)[1] - 20)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5);

    setLoading(false);

    return () => {
      tooltip.remove();
      tooltipBg.remove();
    };
  }, [
    data,
    availableStates,
    themeColors,
    router,
    excludedStates,
    northeastStates,
  ]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (svgRef.current && !svgRef.current.contains(event.target as Node)) {
  //       // const clickedElement = event.target as HTMLElement;
  //       // Exclude button from triggering state reset
  //       // if (!clickedElement.closest(".button")) {
  //       //   setSelectedState("");
  //       // }
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const handleNavigate = () => {
  //   router.push("/states/" + availableStates[selectedState]);
  // };

  return (
    <div className="relative pb-[66.67%]">
      <svg
        ref={svgRef}
        className={`absolute w-full h-full cursor-pointer ${loading ? "opacity-0" : "opacity-100"} z-10`}
        viewBox={"80 0 875 500"}
      />

      <img
        src="/m.png"
        alt="Map loading"
        className={`absolute w-full h-full object-cover ${loading ? "opacity-100" : "opacity-0"} z-0`}
      />
    </div>

    // <div className="relative">
    //   <svg
    //     className="h-full w-full cursor-pointer"
    //     ref={svgRef}
    //     viewBox={viewBox}
    //   />

    //</div>
  );
};

export default Map;
