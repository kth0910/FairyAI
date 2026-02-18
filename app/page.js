import styles from "./page.module.css";
import Sidebar from "../components/Sidebar";
import Workspace from "../components/Workspace";

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Workspace />
    </div>
  );
}
