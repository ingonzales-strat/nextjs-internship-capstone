import { SignUp } from "@clerk/nextjs";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-platinum-900 dark:bg-outer_space-600 px-4">
    
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 mb-2">Create Account</h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-400">Join our project management platform</p>
        </div>

        <SignUp fallback={<div>Loading sign up...</div>}/>

    </div>
  )
}

/*
TODO: Task 2.3 Implementation Notes:
- Set up webhook for user data sync (Task 2.5)
*/
