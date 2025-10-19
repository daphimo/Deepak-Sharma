import { useEffect, useRef, useState } from "react";

interface AnimatedBarGraphProps {
  mainMetricValue: number;
  mainMetricLabel: string;
  newMetricValue: number;
  newMetricLabel: string;
  mainColor: string;
  newColor: string;
  wrapperClassName?: string;
}

const AnimatedBarGraph: React.FC<AnimatedBarGraphProps> = ({
  mainMetricValue,
  mainMetricLabel,
  newMetricValue,
  newMetricLabel,
  mainColor,
  newColor,
  wrapperClassName = "",
}) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0]);
  const maxValue = 100;

  const instanceId = useRef(
    `graph-${Math.random().toString(36).substring(2, 9)}`
  ).current;

  const metrics = [
    { label: mainMetricLabel, value: mainMetricValue, color: mainColor },
    { label: newMetricLabel, value: newMetricValue, color: newColor },
  ];

  const svgWidth = 900;
  const svgHeight = 500;
  const xOffset = 40; // shift everything right

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateGraph();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (graphRef.current) observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const animateGraph = () => {
    metrics.forEach((metric, index) => {
      const delay = index * 250;

      const barDuration = 1000;
      const lineDuration = 600;
      const valueDuration = 800;

      setTimeout(() => {
        const barElement = document.getElementById(
          `${instanceId}-bar-${index}`
        );
        const lineElement = document.getElementById(
          `${instanceId}-line-${index}`
        );
        const metricContainer = document.getElementById(
          `${instanceId}-metric-${index}`
        );
        const startDot = document.getElementById(
          `${instanceId}-start-dot-${index}`
        );
        const endDot = document.getElementById(
          `${instanceId}-end-dot-${index}`
        );

        if (barElement) {
          let startTime: number | null = null;
          const animateBar = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / barDuration, 1);
            const eased = easeInOutQuad(progress);

            const maxBarHeight = svgHeight * 0.6;
            const height = (metric.value / maxValue) * maxBarHeight * eased;
            barElement.setAttribute("height", height.toString());
            barElement.setAttribute("y", (svgHeight - height).toString());

            if (progress < 1) requestAnimationFrame(animateBar);
          };
          requestAnimationFrame(animateBar);
        }

        setTimeout(() => {
          if (lineElement && lineElement instanceof SVGPathElement) {
            const totalLength = lineElement.getTotalLength();
            lineElement.style.strokeDasharray = totalLength.toString();
            lineElement.style.strokeDashoffset = totalLength.toString();
            lineElement.getBoundingClientRect();
            lineElement.style.transition = `stroke-dashoffset ${lineDuration}ms ease-in-out`;
            lineElement.style.strokeDashoffset = "0";
          }

          if (startDot && endDot) {
            startDot.style.transition = `opacity ${lineDuration}ms ease-in`;
            endDot.style.transition = `opacity ${lineDuration}ms ease-in`;
            startDot.style.opacity = "1";
            endDot.style.opacity = "1";
          }

          if (metricContainer) {
            metricContainer.style.opacity = "1";
            metricContainer.style.transform = "translateY(0)";
          }
        }, 700);

        let valueStartTime: number | null = null;
        const animateValue = (timestamp: number) => {
          if (!valueStartTime) valueStartTime = timestamp;
          const elapsed = timestamp - valueStartTime;
          const progress = Math.min(elapsed / valueDuration, 1);
          const eased = easeInOutQuad(progress);
          const current = Math.round(metric.value * eased);
          setAnimatedValues((prev) => {
            const newVals = [...prev];
            newVals[index] = current;
            return newVals;
          });
          if (progress < 1) requestAnimationFrame(animateValue);
        };
        requestAnimationFrame(animateValue);
      }, delay);
    });
  };

  const getLinePath = (index: number, barHeight: number) => {
    const spacing = svgWidth / (metrics.length + 1);
    const barWidth = 120; // wider bar
    const barX = spacing * (index + 1) - barWidth / 2;

    const maxBarHeight = svgHeight * 0.6;
    const barTop = svgHeight - (barHeight / 100) * maxBarHeight;

    const horizontalLength = 200;
    const verticalGap = 30;

    const startX = barX - (horizontalLength + 10);
    const startY = barTop - verticalGap;

    const horizontalSegment = horizontalLength * 0.85;
    const diagonalSegment = horizontalLength * 0.15;
    const midX = startX + horizontalSegment;
    const midY = startY;

    const angle = (145 * Math.PI) / 180;
    const dx = Math.cos(angle) * diagonalSegment;
    const dy = Math.sin(angle) * diagonalSegment;
    const endX = midX + Math.abs(dx);
    const endY = midY + Math.abs(dy);

    const path = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
    return { path, start: { x: startX, y: startY }, end: { x: endX, y: endY } };
  };

  return (
    <div ref={graphRef} className={`${wrapperClassName} `}>
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base line */}
        <line
          x1={svgWidth * 0.05 + xOffset}
          y1={svgHeight - 1}
          x2={svgWidth * 0.95}
          y2={svgHeight - 1}
          stroke="white"
          strokeWidth="2"
        />

        {metrics.map((metric, index) => {
          const barHeight = (metric.value / maxValue) * 100;
          const {  start, end } = getLinePath(index, barHeight);

          const spacing = svgWidth / (metrics.length + 1);
          const barWidth = 120;
          const barX = spacing * (index + 1) - barWidth / 2 + xOffset;

          // shift line and dots
          const shiftedStart = { x: start.x + xOffset, y: start.y };
          const shiftedEnd = { x: end.x + xOffset, y: end.y };
          const shiftedPath = `M ${shiftedStart.x},${shiftedStart.y} L ${shiftedStart.x + (shiftedEnd.x - shiftedStart.x) * 0.85},${shiftedStart.y} L ${shiftedEnd.x},${shiftedEnd.y}`;

          return (
            <g key={index}>
              <rect
                id={`${instanceId}-bar-${index}`}
                x={barX}
                y={svgHeight}
                width={barWidth}
                height={0}
                fill={metric.color}
                rx="0"
              />
              <path
                id={`${instanceId}-line-${index}`}
                d={shiftedPath}
                stroke={metric.color}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
              />
              <circle
                id={`${instanceId}-start-dot-${index}`}
                cx={shiftedStart.x}
                cy={shiftedStart.y}
                r={6}
                fill={metric.color}
                opacity="0"
              />
              <circle
                id={`${instanceId}-end-dot-${index}`}
                cx={shiftedEnd.x}
                cy={shiftedEnd.y}
                r={6}
                fill={metric.color}
                opacity="0"
              />
              <foreignObject
                id={`${instanceId}-metric-${index}`}
                x={shiftedStart.x - 60}
                y={shiftedStart.y - 100}
                width="160"
                height="100"
                opacity={0}
                style={{
                  transform: "translateY(10px)",
                  transition:
                    "opacity 0.4s ease-out, transform 0.4s ease-out",
                }}
              >
                <div className="flex flex-col text-white items-start">
                  <span className="text-6xl font-bold">
                    {animatedValues[index]}%
                  </span>
                  <span className="text-2xl font-medium opacity-90">
                    {metric.label}
                  </span>
                </div>
              </foreignObject>
              <text
                x={barX + barWidth / 2}
                y={svgHeight + 30}
                textAnchor="middle"
                className="fill-white text-2xl font-medium"
              >
                {index === 0 ? "Before" : "After"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedBarGraph;
