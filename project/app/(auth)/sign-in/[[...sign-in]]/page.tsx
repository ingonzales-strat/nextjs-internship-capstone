import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-platinum-900 dark:bg-outer_space-600 px-4">
     
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 mb-2">Welcome Back</h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-400">Sign in to your project management account</p>
        </div>       
        <SignIn fallback={<div>Loading sign in...</div>}/>
        

    </div>
  )
}

