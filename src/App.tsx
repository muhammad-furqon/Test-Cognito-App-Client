// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import { useAuth } from "react-oidc-context";
import outputs from "../amplify_outputs.json"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "../amplify/data/resource"
// import styled from 'styled-components';

Amplify.configure(outputs)
const client = generateClient<Schema>()

// Get query variable
function getQueryVariable(variable: string)
{
  var query = window.location.search.substring(1);
  // console.log(query)//"app=article&act=news_content&aid=160990"
  var vars = query.split("&");
  // console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
    if(pair[0] == variable){return pair[1];}
  }
    return(null);
}

//Call backend testFunction using the queries
async function testFunction(code: string){
  try {
    //Call testFunction 
    const response = await client.queries.testFunction(
      {
        code: code 
      },
      // { 
      //   authMode: 'oidc'
      // }
    )
    console.log('Backend Response: ',response);
    if(response.data){
      console.log('Backend Context: ',JSON.parse(response.data?.context));
      console.log('Backend Event: ',JSON.parse(response.data?.event));
    }

    //Hard coded for now
    // const options = {
    //   // uri: 'https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token',
    //   // transform: _include_headers,
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       // 'Authorization': 'Basic ' + secret_hash
    //   },
    //   body: {
    //       'grant_type': 'authorization_code',
    //       'client_id': '3mkraeveoupe6pdobo977hjgr7',
    //       'code': code,
    //       'redirect_uri': 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    //   }
    // };

    //Hard coded for now
    const clientId = '3mkraeveoupe6pdobo977hjgr7';
    const clientSecret = 'g6dpi4qn5qgm1e81t6vmbfsda64bhfm8bhdfr6ngrhtg3kep6jg';
    const credentials = `${clientId}:${clientSecret}`;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      // redirect_uri: 'http://localhost:5173/', 
      redirect_uri: 'https://main.d2d1d8kuit8n8u.amplifyapp.com/'
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(credentials)}`,
      },
      body: body.toString()
    }

    try{
        console.log('options', options);
        const response = await fetch('https://lambda-furl-d2d1d8kuit8n8u.auth.ap-northeast-1.amazoncognito.com/oauth2/token', options);  
        console.log('response cognito',response);
    }
    catch (error){
        console.log("failed to exchange cognito code to token");
        console.log('error',error);
    }
    } catch (error) {
      console.error(error);
      console.log('error',error);
    }
}

// function getCookieValue(name:string){
//   console.log(document.cookie);
//   const cookies = document.cookie.split('; ');
//   const cookie = cookies.find(row => row.startsWith(`${name}=`));
//   return cookie ? cookie.split('=')[1] : null;
// };

// app-client
// App.js
function App() {
  const code = getQueryVariable('code');
  // const code = getCookieValue('code')

  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "3mkraeveoupe6pdobo977hjgr7";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://main.d2d1d8kuit8n8u.amplifyapp.com/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  // console.log(`Code: ${code},\nQuery var: ${queryVar},\nLocation: ${location}`);
  console.log(`Code ${code}`);
  console.log(`ID Token: ${auth.user?.id_token},\nAccess Token: ${auth.user?.access_token},\nRefresh Token: ${auth.user?.refresh_token}`);
  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        {/* <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}


        {code && (
          <button onClick={() => testFunction(code)}>Test function</button>
        )}

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
  
export default App;

// const client = generateClient<Schema>();

// function App() {
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   useEffect(() => {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({ content: window.prompt("Todo content") });
//   }

//   return (
//     <main>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>{todo.content}</li>
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
//           Review next step of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }

// export default App;
