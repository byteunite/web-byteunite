import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/lib/types";

interface AuthState {
    user: User | null;
    login: (email: string, pass: string) => void;
    register: (name: string, email: string, pass: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (email, password) => {
                // Mock login: any credentials work
                console.log(`Mock login for ${email}`);
                const mockUser: User = {
                    id: "user-1",
                    name: "Pengguna Retro",
                    email: email,
                    avatarUrl: "https://i.pravatar.cc/150?u=retro-user",
                };
                set({ user: mockUser });
            },
            register: (name, email, password) => {
                // Mock register
                console.log(`Mock register for ${name} with email ${email}`);
                const newUser: User = {
                    id: uuidv4(),
                    name: name,
                    email: email,
                    avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
                };
                set({ user: newUser });
            },
            logout: () => {
                console.log("User logged out");
                set({ user: null });
            },
        }),
        {
            name: "auth-storage", // unique name
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
