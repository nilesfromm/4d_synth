import React, {
    SyntheticEvent,
    useState,
    useCallback,
    useEffect,
    useMemo
  } from "react";
  
  const BOTTOM_ANGLE_DEG = 45;
  const RAD = Math.PI / 180;
  const START_ANGLE = Math.PI * 1.5 - (RAD * BOTTOM_ANGLE_DEG) / 2;
  const END_ANGLE = Math.PI * -0.5 + (RAD * BOTTOM_ANGLE_DEG) / 2;
  
  function getPointPair(r, angle, distance) {
    return [r + distance * Math.cos(angle), r - distance * Math.sin(angle)];
  }
  
  function DialMask({ id, size, startAngle, endAngle }) {
    const r = size / 2;
  
    const intermediatePoints = [0, 0.25, 0.5, 0.75, 1]
      .map((fraction) =>
        getPointPair(
          r,
          startAngle - (startAngle - endAngle) * fraction,
          r * 4
        ).join(",")
      )
      .join(" ");
  
    return (
      <mask id={id}>
        <polygon
          style={{ fill: "#fff" }}
          points={`${r},${r} ${intermediatePoints} ${r},${r}`}
        />
      </mask>
    );
  }
  
  function getKnobValue(dragStart, currentY, s=1, bipolar) {
    const { y, value } = dragStart;
    const deltaY = y - currentY;
    const slope = 0.01 * s;
    let newValue = value + deltaY * slope;
    if (bipolar) {
      const zeroCrossingResistance = 0.3;
      if (value >= 0 && newValue < 0) {
        newValue += Math.min(zeroCrossingResistance, -newValue);
      } else if (value < 0 && newValue > 0) {
        newValue -= Math.min(zeroCrossingResistance, newValue);
      }
    }
    // Clamp
    return Math.max(bipolar ? -1 : 0, Math.min(1, newValue));
  }
  
  export default function Dial({
    bipolar = false,
    value = 0,
    onChange,
    size = 40,
    fillColor = "#E0E0E0",
    fillWidth = 5,
    dotSize = 2,
    min = 20,
    max = 1,
    scale = max-min
  }) {
    value = value / scale;
  
    // Clamp input value
    const clamped = Math.max(bipolar ? -1 : 0, Math.min(1, value));
    if (value !== clamped) {
      value = clamped;
      onChange(min + (clamped * scale));
    }
  
    const r = size / 2;
    const uid = useMemo(() => Dial.id++, []);
    const zeroAngle = bipolar ? Math.PI / 2 : START_ANGLE;
    const range = bipolar
      ? (START_ANGLE - END_ANGLE) / 2
      : START_ANGLE - END_ANGLE;
    const valueAngle = bipolar
      ? Math.PI / 2 - value * range
      : START_ANGLE - value * range;
    const [dragStart, setDragStart] = useState<any>(null);
    const isDragging = Boolean(dragStart);
  
    const onMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!dragStart) return;
        let speed = 1;
        if (e.shiftKey){
          speed = 0.1;
        }
        const newValue = getKnobValue(dragStart, e.clientY, speed, bipolar);
        onChange((newValue * scale));
      },
      [dragStart, onChange, bipolar, scale]
    );
    const onMouseDown = useCallback(
      (e: SyntheticEvent<Element, MouseEvent>) => {
        if (e.nativeEvent.button !== 0) return;
        e.stopPropagation();
        setDragStart({ value, y: e.nativeEvent.clientY });
        window.addEventListener("mousemove", onMouseMove);
      },
      [setDragStart, onMouseMove, value]
    );
    const onMouseUp = useCallback(() => {
      setDragStart(null);
    }, [setDragStart]);
  
    useEffect(() => {
      if (!isDragging) {
        window.removeEventListener("mousemove", onMouseMove);
      }
      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    }, [isDragging, onMouseMove]);
  
    useEffect(() => {
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, [onMouseUp]);
  
    useEffect(() => {
      if (!onMouseMove) return;
      return () => window.removeEventListener("mousemove", onMouseMove);
    }, [onMouseMove]);
  
    const [dotX, dotY] = getPointPair(
      size / 2,
      valueAngle,
      r - fillWidth - dotSize - 2
    );
  
    return (
      <div
        style={{
          position: "relative",
          cursor: "pointer",
          height: size,
          width: size,
          overflow: "hidden",
          flexShrink: 0
        }}
        onMouseDown={onMouseDown}
      >
        <svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: isDragging ? 1 : 0.7,
            fill: fillColor,
            filter: "inner-shadow(0 2px 2px rgba(0, 0, 0, 0.9))"
            // filter: isDragging ? "brightness(200%)" : undefined
          }}
        >
          <defs>
            {/* <DialMask
              size={size}
              startAngle={START_ANGLE}
              endAngle={END_ANGLE}
              id={`value-track-mask-${uid}`}
            />
            <DialMask
              size={size}
              startAngle={zeroAngle}
              endAngle={valueAngle}
              id={`value-mask-${uid}`}
            /> */}
            <filter id="innershadow" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
              <feOffset dy="2" dx="0"></feOffset>
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>
              
                <feFlood floodColor="#444444" floodOpacity="0.25"></feFlood>
              <feComposite in2="shadowDiff" operator="in"></feComposite>
              <feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>
                  
                  
                <feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>
              <feOffset dy="-2" dx="0"></feOffset>
              <feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>
              
                <feFlood floodColor="#444444" floodOpacity="0.25"></feFlood>
              <feComposite in2="shadowDiff" operator="in"></feComposite>
              <feComposite in2="firstfilter" operator="over"></feComposite>
            </filter>
          </defs>

          {/* Track outer */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            style={{ mask: `url(#value-track-mask-${uid})`, fill: "#E0E0E0", filter: "url(#innershadow)" }}
          />
          {/* Value fill */}
          {/* <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            style={{ mask: `url(#value-mask-${uid})`, fill: "#A3A3A3", filter: "url(#innershadow)" }}
          /> */}
        </svg>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            filter: "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.45))"
          }}
        >
          {/* Knob */}
          <circle
            cx={r}
            cy={r}
            r={r - fillWidth}
            style={{
              fill: "#F2F2F2"
            }}
          />
          {/* Highlight */}
          <circle
            cx={r}
            cy={r}
            r={r - fillWidth}
            style={{
              fill: "transparent"
            }}
            stroke="rgba(255, 255, 255, 0.2)"
          />
        </svg>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          <circle
            cx={dotX}
            cy={dotY}
            r={dotSize}
            style={{
              fill: "#FF7F50"
            }}
          />
        </svg>
      </div>
    );
  }
  Dial.id = 0;
  