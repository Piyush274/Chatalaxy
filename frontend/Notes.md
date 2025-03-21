### Use Ref
Use State re-renders the updated changes without refresh


Use Ref hold a reference(address) of DOM Element or mutable(updatable) value

Le use ref a box that holds a value or a reference to something.
The value inside the box is stored in .current.
You can change what’s inside the box without updating(re-rendering) the componet unlike useState.

Note: Button type should be of type button else it will cause form submission inside forms

```
  Focusing an Input Field with a Button
  
  const inputRef = useRef(null); // Create a box to store the input element

  const handleFocus = () => {
    inputRef.current.focus(); // Use the box to focus the input
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type something..." /> //Links input to the box(useRef)
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );

```

### Proxy

Configuration allows API requests from the React app to be proxied to the backend server, avoiding CORS (Cross-Origin Resource Sharing) issues.

proxy: {
  "/api": {                        // Intercepts any request starting with "/api"
    target: "http://localhost:8080", // Redirects it to the backend server
    changeOrigin: true,             // Modifies the `Origin` header to match the target
  },
},


### React Query (Tanstack Query)

Caching data refers to the process of storing a copy of data in a temporary storage location (cache) so that it can be quickly accessed later without needing to fetch or compute it again

Query: Used for fetching and caching data. Queries fetch automatically(caching)

Mutation: Used for creating, updating, or deleting data. Mutations(changes) are triggered manually

### Throwing Error

generate and throw an error intentionally. This allows you to handle exceptional conditions in your code more effectively by interrupting the normal flow of execution and signaling that something went wrong.


throw new Error("Error sent to nearest catch block")

Raising(throwing) an Error Object with a message, when error thrown program halts execution in the current block and looks for the nearest catch block to handle it.

try 
{
    throw new Error("An unexpected error occurred!");
} 
catch (error) 
{
    console.log(error.message); // Output: "An unexpected error occurred!"
}





