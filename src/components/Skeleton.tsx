interface SkeletonProps {
  w?: string;
  h?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ w = "100%", h = "20px", className = "", style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={{ width: w, height: h, ...style }} />;
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton h="14px" w="60%" />
      <Skeleton h="32px" w="80%" />
      <Skeleton h="12px" />
      <Skeleton h="12px" w="70%" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <Skeleton w="40px" h="40px" style={{ borderRadius: "50%", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton h="14px" w="50%" />
        <Skeleton h="12px" w="30%" />
      </div>
      <Skeleton h="14px" w="40px" />
    </div>
  );
}
