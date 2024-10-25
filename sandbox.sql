create table users (  -- Start creating a new table named 'users'
  
  id uuid primary key references auth.users (id) not null,  -- Column 'id' of type UUID; it is the primary key and references the 'id' column in 'auth.users'; cannot be null
  
  email text unique not null,  -- Column 'email' of type text; must be unique and cannot be null
  
  type text default 'USER' check (  -- Column 'type' of type text; defaults to 'USER'; must satisfy the check constraint
    type in ('USER', 'ADMIN')  -- Ensures 'type' can only be 'USER' or 'ADMIN'
  ),
  
  avatar_url text not null,  -- Column 'avatar_url' of type text; cannot be null
  
  created_at timestamp default current_timestamp  -- Column 'created_at' of type timestamp; defaults to the current date and time when a record is created
);


-- https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png





/* 
### Breakdown of the Line:

1. **`create or replace function`**:
   - This part indicates that you are either creating a new function or replacing an existing function with the same name in the specified schema (in this case, `public`). If the function already exists, it will be replaced with the new definition provided.

2. **`public.handle_new_user`**:
   - This specifies the name of the function `handle_new_user` and indicates that it belongs to the `public` schema. PostgreSQL functions are organized into schemas, and `public` is the default schema where functions, tables, and other objects can reside.

3. **`()`**:
   - This empty parentheses indicate that the function takes no input parameters. In the context of a trigger function, it doesn't require explicit parameters because it will operate on the `NEW` and `OLD` records that the trigger refers to.

4. **`returns trigger`**:
   - This part specifies the return type of the function. In this case, it indicates that the function will return a `trigger` type, which means it's intended to be used with an `AFTER`, `BEFORE`, or `INSTEAD OF` trigger in PostgreSQL. Trigger functions operate in response to certain events on a specified table (like INSERT, UPDATE, DELETE).

5. **`as $$`**:
   - This marks the beginning of the function body. The `$$` syntax is used as a delimiter for the function definition, allowing you to avoid escaping single quotes and other characters in the SQL code.

### Summary
In summary, this line defines a PostgreSQL function named `handle_new_user` in the `public` schema, specifying that it returns a trigger type and begins the function's body. It's the essential setup for creating trigger logic that can be automatically invoked on specific database actions.

*/




create or replace function public.handle_new_user () returns trigger as $$
begin
  -- Check if the 'avatar_url' in 'raw_user_meta_data' is null or empty
  if new.raw_user_meta_data->>'avatar_url' is null or new.raw_user_meta_data->>'avatar_url' = '' then
    -- Set a default avatar URL if 'avatar_url' is not provided
    new.raw_user_meta_data = jsonb_set(new.raw_user_meta_data, 
                                        '{avatar_url}', 
                                        '"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"' ::jsonb);
  end if;

  -- Insert the new user details into the 'users' table
  insert into public.users (id, email, avatar_url)
  values(new.id, new.email, new.raw_user_meta_data->>'avatar_url'); -- Use the 'avatar_url' from 'raw_user_meta_data'

  -- Return the modified new user record
  return new;
end;
$$ language plpgsql security definer;





create or replace trigger on_auth_user_created  -- Create or replace a trigger named 'on_auth_user_created'
after insert on auth.users                       -- Specify that the trigger should activate after an INSERT operation on the 'auth.users' table
for each row                                     -- Indicate that the trigger will execute for each row affected by the INSERT
execute procedure public.handle_new_user();      -- Execute the function 'handle_new_user' defined in the 'public' schema when the trigger is fired
