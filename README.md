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

---

# Commit Metadata Action

> A GitHub action to extract metadata from commit messages.

---

## Example Workflow

```yml
# Workflow name:
name: Test GitHub Action

# Workflow triggers:
on:
  push:

jobs:
  test:
    # Define the type of virtual host machine on which to run the job:
    runs-on: ubuntu-latest

    # Define the sequence of job steps...
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: |
          npm install
      - id: extract-metadata
        uses: ./
      - name: Log output of the previous step
        run: |
          echo "This is the output of the previous step:"   
          echo ${{ steps.extract-metadata.outputs.metadata }}
```

## Outputs 

  * `metadata`: The array of metadata extracted from the commit messages.

Metadata should be supplied as a block of YAML code in the commit message enclosed with `---` characters at the beginning and end of the block. The metadata blocks from all commit message in a push or pull request are parsed and stored in the output `metadata` array. For example, take the following commit message:

```txt
This commit has a metadata block.

---
type: tweet
author: "@kgryte, @Planeshifter"
status: This is a test tweet
---
```

The `metadata` array would contain the following:

```json
[
    {
        "type": "tweet",
        "author": "@kgryte, @Planeshifter",
        "status": "This is a test tweet"
    }
]
```

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2021. The Stdlib [Authors][stdlib-authors].

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/assign-issue-on-label-action/master/LICENSE

</section>

<!-- /.links -->