import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const MainLayout = ({ 
  children, 
  title = 'Mshiko Tap - Earn Money Completing Tasks', 
  requireAuth = false,
  requireAdmin = false
}: MainLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  React.useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(router.asPath));
    }
    
    if (requireAdmin && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [requireAuth, requireAdmin, router, session, status]);
  
  if ((requireAuth || requireAdmin) && status === 'loading') {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Complete tasks and earn money with Mshiko Tap" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MainLayout; 