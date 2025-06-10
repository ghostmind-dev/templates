# templates

## Available GraphQL Methods

### Query Operations
- **templates** - Fetch data from the templates table
  - Parameters: `distinct_on`, `limit`, `offset`, `order_by`, `where`
  - Returns: Array of templates

- **templates_aggregate** - Fetch aggregated fields from the templates table
  - Parameters: `distinct_on`, `limit`, `offset`, `order_by`, `where`
  - Returns: Aggregated data with count, avg, max, min, stddev, sum, variance fields

- **templates_by_pk** - Fetch data from templates table using primary key
  - Parameters: `templateId` (Int, required)
  - Returns: Single template object

### Mutation Operations
- **delete_templates** - Delete multiple rows from templates table
  - Parameters: `where` (required filter condition)
  - Returns: Mutation response with affected rows count

- **delete_templates_by_pk** - Delete single row by primary key
  - Parameters: `templateId` (Int, required)
  - Returns: Deleted template object

- **insert_templates** - Insert multiple rows into templates table
  - Parameters: `objects` (array of template objects, required), `on_conflict` (optional)
  - Returns: Mutation response with inserted data

- **insert_templates_one** - Insert single row into templates table
  - Parameters: `object` (template object, required), `on_conflict` (optional)
  - Returns: Inserted template object

- **update_templates** - Update multiple rows in templates table
  - Parameters: `_inc` (increment values), `_set` (set values), `where` (required filter)
  - Returns: Mutation response with updated data

- **update_templates_by_pk** - Update single row by primary key
  - Parameters: `_inc`, `_set`, `pk_columns` (required primary key)
  - Returns: Updated template object

- **update_templates_many** - Update multiple rows with different conditions
  - Parameters: `updates` (array of update operations, required)
  - Returns: Array of mutation responses

### Subscription Operations
- **templates** - Subscribe to changes in templates table
  - Parameters: `distinct_on`, `limit`, `offset`, `order_by`, `where`
  - Returns: Real-time stream of template arrays

- **templates_aggregate** - Subscribe to aggregated data changes
  - Parameters: `distinct_on`, `limit`, `offset`, `order_by`, `where`
  - Returns: Real-time stream of aggregated data

- **templates_by_pk** - Subscribe to changes for specific template by primary key
  - Parameters: `templateId` (Int, required)
  - Returns: Real-time stream of single template object

- **templates_stream** - Stream templates data in batches
  - Parameters: `batch_size` (Int, required), `cursor` (required), `where` (optional filter)
  - Returns: Streaming data in batches

### Template Schema
The `templates` table has the following structure:
- **templateId** (Int, Primary Key) - Unique identifier for the template
- **name** (String, Required) - Name of the template

### Available Input Types
- `templates_insert_input` - For inserting new templates
- `templates_set_input` - For updating template fields
- `templates_bool_exp` - For filtering templates with boolean expressions
- `templates_order_by` - For ordering template results
- `templates_on_conflict` - For handling conflicts during inserts

### Comparison Operators
- String fields support: `_eq`, `_gt`, `_gte`, `_ilike`, `_in`, `_iregex`, `_like`, `_lt`, `_lte`, `_neq`, `_nilike`, `_nin`, `_niregex`, `_nlike`, `_nregex`, `_nsimilar`, `_regex`, `_similar`
- Integer fields support: `_eq`, `_gt`, `_gte`, `_in`, `_is_null`, `_lt`, `_lte`, `_neq`, `_nin`

## Latest Subject Added

Okay, this is the new subject that has been added to the database:

- **ID**: 1
- **Name**: bolean
- **Source**: the singwer