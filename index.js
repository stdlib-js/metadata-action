/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// MODULES //

const core = require( '@actions/core' );
const github = require( '@actions/github' );
const yaml = require( 'js-yaml' );


// VARIABLES //

const RE_YAML_BLOCK = /^(?:\s*)---([\S\s]*?)---/;


// MAIN //

async function main() {
	try {
		const context = github.context;
		const { event } = context.payload;
		const message = event.head_commit.message;
		core.info( message );

		let metadata = message.match( RE_YAML_BLOCK );
		if ( metadata ) {
			// Extract the capture group:
			metadata = metadata[ 1 ];
			core.info( metadata );
		} else {
			core.info( 'No metadata block found in commit message.' );
		}
	} catch ( e ) {
		core.error( e );
		core.setFailed( e.message );
	}
}

main();