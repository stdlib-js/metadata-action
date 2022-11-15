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

import { debug, error, info, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';
import isNull from '@stdlib/assert-is-null';
import yaml from 'js-yaml';


// TYPES //

type CommitMessage = { message: string, url: string, id: string, author: string };
type MetadataObject = { type?: string, message: string, url: string, id: string, author: string, [key: string]: any };


// VARIABLES //

const RE_YAML_BLOCK = /(```(?=yaml)|---)(?:yaml)?([\S\s]*?)\1/g;


// FUNCTIONS //

/**
* Extracts the subject line of a commit.
* 
* @private
* @param message - commit message
* @returns subject line of commit
*/
function extractSubjectFromCommitMessage( message: string ): string {
	return message.split( '\n' )[ 0 ];
}

/**
* Extracts the commit messages from the payload of a GitHub action event.
*
* @private
* @returns commit message objects
*/
function extractCommitMessages(): Array<CommitMessage> {
	const out = [];
	const payload = context.payload;
	if ( !payload ) {
		return out;
	}
	switch ( context.eventName ) {
	case 'push':
	case 'pull_request': 
	case 'pull_request_target': {
		const commits = payload.commits;
		if ( commits ) {
			for ( let i = 0; i < commits.length; i++ ) {
				const commit = commits[ i ];
				debug( 'Processing commit: '+JSON.stringify( commit ) );
				if ( commit.message ) {
					out.push({
						message: commit.message,
						url: commit.url,
						id: commit.id,
						author: commit.author
					});
				}
			}
		}
		return out;
	}
	default:
		throw new Error( `Unsupported event type: ${context.eventName}` );
	}
}


// MAIN //

/**
* Main function.
*
* @returns promise indicating completion
*/ 
async function main(): Promise<void> {
	switch ( context.eventName ) {
	case 'push':
	case 'pull_request':
	case 'pull_request_target': {
		try {
			const messages = extractCommitMessages();
			const metadata: MetadataObject[] = [];
			debug( 'Commit messages: '+messages.join( '\n' ) );
			for ( let i = 0; i < messages.length; i++ ) {
				const { author, id, message, url } = messages[ i ];
				let match = RE_YAML_BLOCK.exec( message );
				while ( !isNull( match ) ) {
					// Extract the first capture group containing the YAML block:
					const metadataBlock = match[ 2 ];
					const meta = yaml.load( metadataBlock );
					meta.description = meta.description || extractSubjectFromCommitMessage( message );
					meta.author = author;
					meta.id = id;
					meta.url = url; 
					metadata.push( meta );
					match = RE_YAML_BLOCK.exec( message );
				}
			}
			if ( !metadata.length ) {
				info( 'No metadata block found in commit messages.' );
			} 
			setOutput( 'metadata', metadata )
		} catch ( e ) {
			error( e );
			setFailed( e.message );
		}
		break;
	}
	case 'issue_comment': {
		const metadata: MetadataObject[] = [];
		const { user, id, body, url } = context.payload.comment;
		let match = RE_YAML_BLOCK.exec( body );
		while ( !isNull( match ) ) {
			// Extract the first capture group containing the YAML block:
			const metadataBlock = match[ 2 ];
			const meta = yaml.load( metadataBlock );
			meta.author = user;
			meta.id = id;
			meta.url = url; 
			metadata.push( meta );
			match = RE_YAML_BLOCK.exec( body );
		}
		if ( !metadata.length ) {
			info( 'No metadata block found in commit messages.' );
		} 
		setOutput( 'metadata', metadata );
		break;
	}
	default:
		setFailed( `Unsupported event type: ${context.eventName}` );
	}
}

main();