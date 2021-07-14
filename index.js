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


// FUNCTIONS //

/**
* Extracts the commit messages from the payload of a GitHub action event.
*
* @private
* @returns {Array} commit messages
*/
function extractCommitMessages() {
	const out = [];
	switch ( github.context.eventName ) {
	case 'pull_request': {
		const pullRequest = github.context.payload?.pull_request;
		if ( pullRequest ) {
			let msg = pullRequest.title;
			if ( pullRequest.body ) {
				msg = msg.concat( '\n\n', pullRequest.body );
			}
			out.push( msg );
		}
		return out;
	}
	case 'push': {
		const commits = github.context.payload?.commits;
		if ( commits ) {
			for ( let i = 0; i < commits.length; i++ ) ) {
				const commit = commits[ i ];
				if ( commit.message ) {
					out.push( commit.message );
				}
			}
		}
		return out;
	}
	default:
		throw new Error( `Unsupported event type: ${github.context.eventName}` );
	}
}


// VARIABLES //

const RE_YAML_BLOCK = /^(?:\s*)---([\S\s]*?)---/;


// MAIN //

async function main() {
	try {
		const messages = extractCommitMessages();
		core.info( messages );

		let metadata = messages[ 0 ].match( RE_YAML_BLOCK );
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