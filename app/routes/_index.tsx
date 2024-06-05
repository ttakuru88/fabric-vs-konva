import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "konva VS fabric" },
    { name: "description", content: "haha" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Konva VS Fabric</h1>
      <ul>
        <li>
          <Link to={'/konva'}>Konva</Link>
        </li>
        <li>
          <Link to={'/fabric'}>Fabric</Link>
        </li>
      </ul>
    </div>
  );
}
