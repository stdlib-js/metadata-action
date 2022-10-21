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
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const assert_is_null_1 = __importDefault(require("@stdlib/assert-is-null"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// VARIABLES //
const RE_YAML_BLOCK = /---([\S\s]*?)---/g;
// FUNCTIONS //
/**
* Extracts the subject line of a commit.
*
* @private
* @param message - commit message
* @returns subject line of commit
*/
function extractSubjectFromCommitMessage(message) {
    return message.split('\n')[0];
}
/**
* Extracts the commit messages from the payload of a GitHub action event.
*
* @private
* @returns commit message objects
*/
function extractCommitMessages() {
    const out = [];
    const payload = github_1.context.payload;
    if (!payload) {
        return out;
    }
    switch (github_1.context.eventName) {
        case 'push': {
            const commits = payload.commits;
            if (commits) {
                for (let i = 0; i < commits.length; i++) {
                    const commit = commits[i];
                    (0, core_1.debug)('Processing commit: ' + JSON.stringify(commit));
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
            throw new Error(`Unsupported event type: ${github_1.context.eventName}`);
    }
}
// MAIN //
/**
* Main function.
*
* @returns promise indicating completion
*/
async function main() {
    try {
        const messages = extractCommitMessages();
        const metadata = [];
        (0, core_1.debug)('Commit messages: ' + messages.join('\n'));
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
            (0, core_1.info)('No metadata block found in commit messages.');
        }
        (0, core_1.setOutput)('metadata', metadata);
    }
    catch (e) {
        (0, core_1.error)(e);
        (0, core_1.setFailed)(e.message);
    }
}
main();
//# sourceMappingURL=index.js.map