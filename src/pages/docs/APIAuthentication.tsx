import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';

const APIAuthentication = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          API Authentication
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Secure your API requests with JWT-based authentication. Learn how to obtain and use access tokens.
        </p>
      </div>

      <DocSection 
        id="overview" 
        title="Authentication Overview"
        subtitle="All Tempo API endpoints require authentication via JWT tokens"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8]">
          Tempo uses JWT (JSON Web Token) authentication to secure all API endpoints. After signing in, 
          you'll receive an access token that must be included in the <code className="text-[14px] px-2 py-0.5 bg-muted/70 rounded">Authorization</code> header 
          of all API requests.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <Shield className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-[17px] mb-2">Secure</h3>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              JWT tokens are signed and verified on every request
            </p>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <Key className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-[17px] mb-2">Stateless</h3>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              No session storage required - tokens contain all needed info
            </p>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <Lock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-[17px] mb-2">Time-Limited</h3>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Tokens expire after 1 hour for enhanced security
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="sign-up" 
        title="Sign Up"
        subtitle="Create a new user account"
      >
        <CodeBlock 
          language="typescript" 
          code={`import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fhmyhvrejofybzdgzxdc.supabase.co',
  'your-anon-key'
);

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      username: 'johndoe'
    }
  }
});

if (error) {
  console.error('Sign up failed:', error.message);
} else {
  console.log('User created:', data.user);
  console.log('Access token:', data.session?.access_token);
}`}
        />

        <Callout type="info" title="Auto-Confirm Enabled">
          Email confirmation is automatically enabled in this project. Users can start using the API immediately after signup.
        </Callout>
      </DocSection>

      <DocSection 
        id="sign-in" 
        title="Sign In"
        subtitle="Authenticate an existing user"
      >
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

if (error) {
  console.error('Sign in failed:', error.message);
} else {
  const token = data.session.access_token;
  const refreshToken = data.session.refresh_token;
  
  console.log('Access token:', token);
  console.log('Token expires at:', new Date(data.session.expires_at * 1000));
}`}
        />
      </DocSection>

      <DocSection 
        id="using-tokens" 
        title="Using Access Tokens"
        subtitle="Include the JWT token in API requests"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Once you have an access token, include it in the <code className="text-[14px] px-2 py-0.5 bg-muted/70 rounded">Authorization</code> header 
          of all API requests:
        </p>

        <CodeBlock 
          language="typescript" 
          code={`// Using the Supabase client (recommended)
const { data, error } = await supabase.functions.invoke('user-profile', {
  method: 'GET',
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});

// Using fetch API directly
const response = await fetch(
  'https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1/user-profile',
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();`}
        />

        <Callout type="warning" title="Token Security">
          Never expose your access tokens in client-side code or commit them to version control. Store them securely 
          and transmit them only over HTTPS.
        </Callout>
      </DocSection>

      <DocSection 
        id="refresh-tokens" 
        title="Refreshing Tokens"
        subtitle="Extend your session with refresh tokens"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Access tokens expire after 1 hour. Use the refresh token to obtain a new access token without requiring the user to sign in again:
        </p>

        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.auth.refreshSession({
  refresh_token: refreshToken
});

if (error) {
  console.error('Token refresh failed:', error.message);
  // Redirect user to sign in again
} else {
  const newAccessToken = data.session.access_token;
  const newRefreshToken = data.session.refresh_token;
  
  // Update stored tokens
  console.log('New access token:', newAccessToken);
}`}
        />

        <Callout type="tip" title="Automatic Refresh">
          The Supabase client automatically refreshes tokens when they expire. You typically don't need to handle this manually.
        </Callout>
      </DocSection>

      <DocSection 
        id="sign-out" 
        title="Sign Out"
        subtitle="Invalidate the current session"
      >
        <CodeBlock 
          language="typescript" 
          code={`const { error } = await supabase.auth.signOut();

if (error) {
  console.error('Sign out failed:', error.message);
} else {
  console.log('User signed out successfully');
  // Clear any cached tokens and redirect to login
}`}
        />
      </DocSection>

      <DocSection 
        id="error-handling" 
        title="Error Handling"
        subtitle="Common authentication errors and how to handle them"
      >
        <div className="space-y-4">
          <div className="border-l-4 border-l-red-500 pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              401 Unauthorized
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7] mb-2">
              The access token is missing, invalid, or expired
            </p>
            <CodeBlock 
              language="json"
              code={`{
  "error": "Unauthorized"
}`}
            />
            <p className="text-[14px] text-muted-foreground mt-2">
              <strong>Solution:</strong> Refresh the access token or prompt the user to sign in again
            </p>
          </div>

          <div className="border-l-4 border-l-red-500 pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Invalid Login Credentials
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7] mb-2">
              The email or password provided is incorrect
            </p>
            <CodeBlock 
              language="json"
              code={`{
  "error": "Invalid login credentials"
}`}
            />
            <p className="text-[14px] text-muted-foreground mt-2">
              <strong>Solution:</strong> Verify the email and password and try again
            </p>
          </div>

          <div className="border-l-4 border-l-red-500 pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              User Already Registered
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7] mb-2">
              An account with this email already exists
            </p>
            <CodeBlock 
              language="json"
              code={`{
  "error": "User already registered"
}`}
            />
            <p className="text-[14px] text-muted-foreground mt-2">
              <strong>Solution:</strong> Use the sign in endpoint instead or recover the password
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="best-practices" 
        title="Best Practices"
      >
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Store Tokens Securely</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Use secure storage mechanisms like httpOnly cookies or encrypted local storage. Never expose tokens in URLs or logs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Implement Token Refresh Logic</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Automatically refresh tokens before they expire to provide a seamless user experience.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Handle Errors Gracefully</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Always check for authentication errors and redirect users to the login page when their session expires.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Use HTTPS Only</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Always transmit tokens over HTTPS to prevent man-in-the-middle attacks.
              </p>
            </div>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default APIAuthentication;
