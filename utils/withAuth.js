"use client";
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin') === "true";

      if (!token) {
        router.push('/login'); // Redirect to login if no token
        return;
      }

      try {
        const decodedToken = jwt.decode(token);

        if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
          router.push('/login'); // Redirect if token is invalid or expired
          return;
        }

        if (allowedRoles.includes("admin") && !isAdmin) {
          console.log("Redirecting to login...");  // <-- Add this
          router.push('/login');
          return;
        }
        
        
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login'); // Redirect on error
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return AuthenticatedComponent;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
