interface RandomShapeProps {
    fillColor?: string;
    strokeColor?: string;
    className?: string;
    isBottom?: boolean;
}

export default function RandomShape({
    fillColor = "currentColor",
    strokeColor = "currentColor",
    className = "absolute top-0 right-0 w-32 h-32 opacity-10 rotate-45",
    isBottom = false,
}: RandomShapeProps) {
    const shapes = [
        // Square
        {
            type: "rect",
            element: (
                <rect
                    x="50"
                    y="50"
                    width="100"
                    height="100"
                    className="opacity-0"
                />
            ),
        },
        // Circle
        { type: "circle", element: <circle cx="80" cy="80" r="50" /> },
        // Triangle (equilateral)
        {
            type: "polygon",
            element: (
                <polygon
                    points="100,30 30,170 170,170"
                    className="-rotate-90"
                />
            ),
        },
        // quote symbol
        {
            type: "text",
            element: <span className="text-[12em]">"</span>,
        },
    ];

    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    if (randomShape.type === "text") {
        return (
            <div
                className={`${className} ${
                    isBottom
                        ? "-rotate-180 -left-[100px] -bottom-[40px]"
                        : "-top-25"
                }`}
                style={{
                    color: fillColor,
                }}
            >
                {randomShape.element}
            </div>
        );
    }

    return (
        <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Clone the element with fill and stroke props */}
            {randomShape.element.type === "rect" && (
                <rect
                    {...randomShape.element.props}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                />
            )}
            {randomShape.element.type === "circle" && (
                <circle
                    {...randomShape.element.props}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                />
            )}
            {randomShape.element.type === "polygon" && (
                <polygon
                    {...randomShape.element.props}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                />
            )}
            {randomShape.element.type === "text" && (
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.5"
                    fontSize="48"
                >
                    {randomShape.element.props.children}
                </text>
            )}
        </svg>
    );
}
