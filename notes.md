# `.d.ts` files

We will be creating many data types while working on a project. These types allow the compiler to enforce compile time type safety checks and provide better error messages. VS Code will also use these types to provide use with more accurate autocompletion. 

However, all of these types declarations will end up cluttering our code and make it difficult to read. We'll have many declarations interspersed with our program logic (which is what we actually want to focus on). So we can add our type declarations to `.d.ts` files in our `src/types/` directory. These are called **type declaration files**.

The compiler will check for any `.d.ts` files and use them during compilation. You don't even need to import these types into your code!

You will create a `.d.ts` file in a later section.

# Record<Keys, Type>

We have covered how to create types to describe the structure of an object. For example:

```ts
type Point3D = {
  x: number;
  y: number;
  z: number;
};

const player: Point3D = {
  x: 12,
  y: 80,
  z: -4
};
```

This is relatively straightforward if your object's keys are known at compile time. In the case above we are requiring that the object's keys **must be** `x`, `y`, and `z`. 

However, what if we wanted the keys to be arbitrary strings? This method for defining a type would not work. Instead we could define our type by using TypeScript's Utility Type `Record<>`.

Let's use the class example:

```ts
const stateCapitals = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};
```

The `stateCapital` constant's datatype is literally:

```ts
{
  Arkansas: 'Little Rock';
  Texas: 'Austin';
  Idaho: 'Salem';
}
```

This means it can only have the data for `Arkansas`, `Texas` and `Idaho`. We cannot add data for my state since we would need to supply all of the state names (and their capitals) when we wrote the code. But for this exercise we want to expose a web api that would allow a user to add the data for the missing states at runtime. So we can use the `Record<>` type for our `stateCapitals`.

The `Record<>` type takes two type parameters. The angle brackets are the **type parameter list** which specify the data types `Record` will use. The syntax for for `Record` is: `Record<KeyDataType, ValueDataType>`. Where we specify the datatype that we will use for the key and the type we will use for the property value.

So if we wanted to use arbitrary strings for the keys and values we would use:

```ts
const stateCapitals: Record<string, string> = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};
```

This works well enough; however, we shouldn't really allow *any* string for the state name since we know what the exact names for the 50 states are. We should restrict the key to only being one of the 50 state names. We can do this by creating a new **Union type**.

https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type


# Union Types

A **union type** is a type that is formed by combining 2 or more other types (in other words we form a union). First, we'll look at an example. Hypothetically, what if we wanted to have an array that contained either `Point2D` elements or `Point3D` elements?

```ts
const bases2D: Array<Point2D> = []; // Only contains Point2D elements
const bases3D: Array<Point3D> = []; // Only contains Point3D elements
```

The arrays above can only contain elements of a single type. However, we can use the union operator `|` (a single vertical bar/pipe) to form a union of the `Point2D` and `Point3D` types.

```ts
// This array contains a mixture of both Point2D and/or Point3D elements
const allYourBases: Array<Point2D | Point3D> = [];
```

We will be using this type to restrict the keys to be the name of each state. We will create a `StateName` type that is a union of the literal string names of each of the 50 states.

> Your linter will format this code so each name is on its own line. I just formatted it this way so it wouldn't increase the document size.

We can now use `StateName` instead of `string` for our keys. This will ensure that the key **must** be a valid state name. (However, it will be case-sensitive).

```ts
type StateName =
| 'Alaska'       | 'Alabama'        | 'Arkansas'     | 'Arizona'       | 'California'
| 'Colorado'     | 'Connecticut'    | 'Delaware'     | 'Florida'       | 'Georgia' 
| 'Hawaii'       | 'Iowa'           | 'Idaho'        | 'Illinois'      | 'Indiana' 
| 'Kansas'       | 'Kentucky'       | 'Louisiana'    | 'Massachusetts' | 'Maryland' 
| 'Maine'        | 'Michigan'       | 'Minnesota'    | 'Missouri'      | 'Mississippi' 
| 'Montana'      | 'North Carolina' | 'North Dakota' | 'Nebraska'      | 'New Hampshire' 
| 'New Jersey'   | 'New Mexico'     | 'Nevada'       | 'New York'      | 'Ohio'
| 'Oklahoma'     | 'Oregon'         | 'Pennsylvania' | 'Rhode Island'  | 'South Carolina' 
| 'South Dakota' | 'Tennessee'      | 'Texas'        | 'Utah'          | 'Virginia' 
| 'Vermont'      | 'Washington'     | 'Wisconsin'    | 'West Virginia' | 'Wyoming';
```

You should create a file named `stateCapitalTypes.d.ts` in your `src/types` directory and add the `StateName` type declaration to it.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types

Now we can use the following type for the `stateCapitals` constant:

```ts
const stateCapitals: Record<StateName, string> = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};
```

You should notice that you get an error saying that you are missing several state names (+43 more). We'll see how to fix that in the next section.


# Partial<Type>

The `Record<>` type requires that we supply **all** of the `StateName` type's values as keys when we create `stateCapitals` at compile time. However, we want to be able to have a partially filled object and add new states at runtime. So we can use the `Partial<>` Utility Type to accomplish this. Essentially, it just marks the keys as *optional* rather than required. You simply pass the `Record` type as a parameter in `Partial`'s type parameter list.

```ts
const stateCapitals: Partial<Record<StateName, string>> = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};
```

Now this type has gotten pretty gnarly and it is difficult to immediately understand what exactly `stateCapital`'s data type is supposed to be. So let's create a new datatype for it. Add the following to `stateCapitalTypes.d.ts`

```ts
type StateCapitalPairs = Partial<Record<StateName, string>>;
```

And now update your code to use it. This code is now much easier to read and understand.

```ts
const stateCapitals: StateCapitalPairs = {
  Arkansas: 'Little Rock',
  Texas: 'Austin',
  Idaho: 'Salem',
};
```

https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype

# Giving `req.query` a Type

Now we still have another error in our code. The compiler has no idea what type `req.query` must be. This is because `req.query` was designed to be flexible enough to allow any data the query parameters could possibly contain. However, since we are designing the server we know what the query **must** contain for this specific endpoint. So we can use TypeScript's `as` keyword to perform a **type assertion**. We are *asserting* that `req.query` must be a specific type (of our choosing).

Since we've designed this server API we know that the request's query parameters may contain a `state` parameter which should be the name of a state. So we can assert that `req.query` must be our own custom type which contains a `state` property of type `StateName`. Add the following type to `stateCapitalTypes.d.ts`.

```ts
type CapitalRequestQuery = {
  state: StateName;
};
```

Now update your `getCapital()` function to use the new type.

```ts
function getCapital(req: Request, res: Response): void {
  if (req.query.state) {
    const { state } = req.query as CapitalRequestQuery;
    if (state in stateCapitals) {
      const stateCapital = stateCapitals[state];
      const stateData = {
        state,
        capital: stateCapital,
      };
      console.log(`User requested data for ${state}`);
      res.json(stateData);
    } else {
      console.log(`User requested data for ${state} but it is not in our dataset`);
      res.sendStatus(400);
    }
  } else {
    console.log('User is requesting all state data');
    res.json(stateCapitals);
  }
}
```

This function is still managing a fair amount of logic. It's doing multiple jobs: checking the query, validating if the state is in the dataset, filtering the data or just getting it all. We should really split it into a couple of smaller functions so that we can simplify the logic. We'll discuss how to do this when we cover **Controllers** & **Models** of the **Model-View-Controller** (**MVC**) design pattern.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
