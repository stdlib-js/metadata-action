"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULES //
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const assert_is_null_1 = __importDefault(require("@stdlib/assert-is-null"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// VARIABLES //
const RE_YAML_BLOCK = /---([\S\s]*?)---/g;
// FUNCTIONS //
/**
* Extracts the subject line of a commit.
*
* @private
* @param {string} message - commit message
* @returns {string} subject line of commit
*/
function extractSubjectFromCommitMessage(message) {
    return message.split('\n')[0];
}
/**
* Extracts the commit messages from the payload of a GitHub action event.
*
* @private
* @returns {Array} commit message objects
*/
function extractCommitMessages() {
    const out = [];
    const payload = github_1.default.context.payload;
    if (!payload) {
        return out;
    }
    switch (github_1.default.context.eventName) {
        case 'push': {
            const commits = payload.commits;
            if (commits) {
                for (let i = 0; i < commits.length; i++) {
                    const commit = commits[i];
                    core_1.default.debug('Processing commit: ' + JSON.stringify(commit));
                    if (commit.message) {
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
            throw new Error(`Unsupported event type: ${github_1.default.context.eventName}`);
    }
}
// MAIN //
/**
* Main function.
*/
async function main() {
    try {
        const messages = extractCommitMessages();
        const metadata = [];
        core_1.default.debug('Commit messages: ' + messages.join('\n'));
        for (let i = 0; i < messages.length; i++) {
            const { author, id, message, url } = messages[i];
            let match = RE_YAML_BLOCK.exec(message);
            while (!(0, assert_is_null_1.default)(match)) {
                // Extract the first capture group containing the YAML block:
                const metadataBlock = match[1];
                const meta = js_yaml_1.default.load(metadataBlock);
                meta.description = meta.description || extractSubjectFromCommitMessage(message);
                meta.author = author;
                meta.id = id;
                meta.url = url;
                metadata.push(meta);
                match = RE_YAML_BLOCK.exec(message);
            }
        }
        if (!metadata.length) {
            core_1.default.info('No metadata block found in commit messages.');
        }
        core_1.default.setOutput('metadata', metadata);
    }
    catch (e) {
        core_1.default.error(e);
        core_1.default.setFailed(e.message);
    }
}
main();
//# sourceMappingURL=index.js.map