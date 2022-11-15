<!--

@license Apache-2.0

Copyright (c) 2021 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

# Metadata Action

> A GitHub action to extract metadata from commit messages and issue comments.

## Example Workflow

```yml
# Workflow name:
name: Test GitHub Action

# Workflow triggers:
on:
  push:

# Workflow jobs:
jobs:
  test:
    # Define the type of virtual host machine on which to run the job:
    runs-on: ubuntu-latest

    # Define the sequence of job steps...
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: |
          npm install
      - id: extract-metadata
        uses: stdlib-js/metadata-action@v2
      - name: Log output of the previous step
        run: |
          echo "This is the output of the previous step:"   
          echo ${{ steps.extract-metadata.outputs.metadata }}
```

## Outputs 

-   `metadata`: the array of metadata extracted from the commit messages.

Metadata should be supplied as one or more blocks of YAML code in the commit message enclosed with `---` characters at the beginning and end of each block. The metadata blocks from all commit messages in a push are parsed and stored in the output `metadata` array. For example, given the following commit message:

```txt
This commit has a metadata block.

---
type: feature
description: This is a description of the feature.
---
```

the corresponding `metadata` array may look like the following:

```json
[
    {
        "type": "feature",
        "description": "This is a description of the feature.",
        "author":{
            "email": "pburckhardt@outlook.com",
            "name": "Planeshifter",
            "username": "Planeshifter"
        },
        "id":"762f39accd4d574db3f1c1480304dddc573840d8",
        "url":"https://github.com/stdlib-js/commit-metadata-action/commit/762f39accd4d574db3f1c1480304dddc573840d8"
    }
]
```

The `description` field is special insofar as it will be populated with the commit message when the YAML block does not contain a `description` field. Hence, the following commit message:

```txt
This commit has a metadata block.

---
type: feature
---
```

may lead to the following `metadata` array:

```json
[
    {
        "type": "feature",
        "description": "This commit has a metadata block.",
        "author":{
            "email": "pburckhardt@outlook.com",
            "name": "Planeshifter",
            "username": "Planeshifter"
        },
        "id":"762f39accd4d574db3f1c1480304dddc573840d8",
        "url":"https://github.com/stdlib-js/commit-metadata-action/commit/762f39accd4d574db3f1c1480304dddc573840d8"
    }
] 
```

Otherwise, all the fields in the YAML block are copied verbatim. The fields `author`, `id`, and `url` are special in that they are populated with the information from the commit object and, thus, should not be supplied in the metadata block.

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2021-2022. The Stdlib [Authors][stdlib-authors].

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/assign-issue-on-label-action/master/LICENSE

</section>

<!-- /.links -->
