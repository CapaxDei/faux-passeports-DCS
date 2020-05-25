// https://observablehq.com/d/37c4a8b8cd704fbc@318
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["passport_dataset@1.csv",new URL("./files/0843572cab8d892cd88ae24b58bb6ef9ff2061a5110e415ecdd1c3eb431670fcd73eaad8e4a2ebca77d60a672931aa7b12dba61f96f55a82003c23a9f0f6d6a7",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Géographie de la vente de faux passports en ligne
    
    Voici un diagramme de Sankey représentant les pays impliqués dnas la distribution de faux passports en vente sur un site du darkweb.
    A partir d'acquisistion et d'analyses de données d'un crypto-marché réalisées entre octobre et novembre 2019, 
    nous avons récoltés 4 indicateurs géographiques distincts : 

    - Les nationalités des passports, c'est-à-dire les nationalités représentées sur les faux passports vendus.
    - Le pays de résidence des vendeurs enregistrés, indiqués sur leur page de profil.
    - Le pays d'envoi sont indiqués par les vendeurs dans un champ particulier de la page web. 
    - Les possibles destinations des passports étaient indiqués dans le corps de l'annonce. 
    Pour cette raison, les destinations ont dû être extraits manuellement, tout comme les nationalités représentées.
    
    Toutes ces données sont renseignées volontairement par le vendeur et sont donc à analyser avec précaution.
    Passez votre souris sur les éléments pour connaitre le nombres de passports exacts. 
    
    L'échantillon analysé est de 1100 annonces environ.
    `
)});
  main.variable(observer("viewof edgeColor")).define("viewof edgeColor", ["html","URLSearchParams"], function(html,URLSearchParams){return(
Object.assign(html`<select>
  <option value=input>Color by input
  <option value=output>Color by output
  <option value=path selected>Color by input-output
  <option value=none>No color
</select>`, {
  value: new URLSearchParams(html`<a href>`.search).get("color") || "path"
})
)});
  main.variable(observer("edgeColor")).define("edgeColor", ["Generators", "viewof edgeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof align")).define("viewof align", ["html","URLSearchParams"], function(html,URLSearchParams){return(
Object.assign(html`<select>
  <option value=left>Left-aligned
  <option value=right>Right-aligned
  <option value=center>Centered
  <option value=justify selected>Justified
</select>`, {
  value: new URLSearchParams(html`<a href>`.search).get("align") || "justify"
})
)});
  main.variable(observer("align")).define("align", ["Generators", "viewof align"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","sankey","data","color","format","edgeColor","DOM"], function(d3,width,height,sankey,data,color,format,edgeColor,DOM)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey(data);

  svg.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", color)
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");

  if (edgeColor === "path") {
    const gradient = link.append("linearGradient")
        .attr("id", d => (d.uid = DOM.uid("link")).id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target));
  }

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => edgeColor === "none" ? "#aaa"
          : edgeColor === "path" ? d.uid 
          : edgeColor === "input" ? color(d.source) 
          : color(d.target))
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
      .text(d => `${format(d.value)}\n${d.source.name} & ${d.target.name}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  return svg.node();
}
);
  main.variable(observer("sankey")).define("sankey", ["d3","align","width","height"], function(d3,align,width,height)
{
  const sankey = d3.sankey()
      .nodeId(d => d.name)
      .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 5], [width - 1, height - 5]]);
  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}
);
  main.variable(observer("format")).define("format", ["d3","data"], function(d3,data)
{
  const format = d3.format(",.0f");
  return data.units ? d => `${format(d)} ${data.units}` : format;
}
);
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return d => color(d.category === undefined ? d.name : d.category);
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  const links = d3.csvParse(await FileAttachment("passport_dataset@1.csv").text(), d3.autoType);
  const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])), name => ({name, category: name.replace(/ .*/, "")}));
  return {nodes, units: "forged passeports",links};
}
);
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-sankey@0.12")
)});
  return main;
}
