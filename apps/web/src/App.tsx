import { useAuth } from "@clerk/react";
import { useEffect } from "react";

import { enableDevelopmentIdentity, setSessionToken } from "./app/authSlice";
import { useAppDispatch, useAppSelector } from "./app/store";
import { SignInScreen } from "./features/auth/SignInScreen";
import { AppLoadingSkeleton } from "./features/app/Skeleton";
import { HeroFlow } from "./features/claim/HeroFlow";

export function DevelopmentApp() {
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(enableDevelopmentIdentity()); }, [dispatch]);
  return <ReadyApp />;
}

export function ClerkApp() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isSignedIn) return;
    let active = true;
    const refresh = () => getToken().then((token) => { if (active) dispatch(setSessionToken(token)); });
    void refresh();
    const timer = window.setInterval(refresh, 50_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [dispatch, getToken, isSignedIn]);
  if (!isLoaded) return <AppLoadingSkeleton />;
  if (!isSignedIn) return <SignInScreen />;
  return <ReadyApp />;
}

function ReadyApp() {
  const ready = useAppSelector((state) => state.auth.ready);
  return ready ? <HeroFlow /> : <AppLoadingSkeleton />;
}
