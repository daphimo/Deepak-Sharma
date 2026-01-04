import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export function useRequireAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const redirectToLogin = () => {
      if (!active) return;
      navigate("/login", { replace: true, state: { from: location.pathname } });
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) redirectToLogin();
      else setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) redirectToLogin();
      else setChecking(false);
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return checking;
}
