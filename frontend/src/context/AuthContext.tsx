import httpStatus from "http-status";
import { createContext, useState } from "react";
import type { ReactNode} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

interface AuthContextType {
  handleRegister: (name: string, username: string, password: string) => Promise<string | undefined>;
  handleLogin: (username: string, password: string) => Promise<void>;
  userData: any;  
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};


export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name: string, username: string, password: string) => {
    try {
      let request = await client.post("/register", {
        name:name,
        username:username,
        password:password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try{
        let request = await client.post("/login",{
            username:username,
            password:password,
        });
        if(request.status === httpStatus.OK){
            localStorage.setItem("token", request.data.token);
        }
    }catch(err){
      throw err;
    }
  };


  return (
    <AuthContext.Provider value={{ handleRegister, handleLogin, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};