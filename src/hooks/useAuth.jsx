import { useContext } from "react";
import { AuthContext } from "../context/authcontextprovider";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("no context found");
  }

  return context;
}
