# BMChain ICO Interface

Currently hosted on server [ico.bmchain.io](https://ico.bmchain.io)

# Features

- generation of new ethereum wallets;
- validation of public and private keys;
- verification of user's balance;
- signing transactions on the client's side;
- sending transactions to Ethereum network;
- integration with an affiliate program on smart contracts;
- user-friendly interface for sending ETH.

# Getting started

1. Install nodejs from [nodejs.org](https://nodejs.org)
 
2. Go to project folder and install dependencies:
 ```bash
 npm install
 ```
3. Launch development server, and open [localhost:4200](http://localhost:4200) in your browser:
 ```bash
 npm start
 ```
 
# Project structure

```
dist/                        compiled version
docs/                        project docs and coding guides
e2e/                         end-to-end tests
src/                         project source code
|- app/                      app components
|  |- core/                  core module (singleton services and single-use components)
|  |- shared/                shared module  (common components, directives and pipes)
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|  +- ...                    additional modules and components
|- assets/                   app assets (images, fonts, sounds...)
|- environments/             values for various build environments
|- theme/                    app global scss variables and theme
|- translations/             translations files
|- index.html                html entry point
|- main.scss                 global style entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
reports/                     test and coverage reports
proxy.conf.js                backend proxy configuration
```

# Licence

Copyright (c) 2017 BMChain

This license governs use of the accompanying software and its source code. If you use the software or read its source code, you accept this license. If you do not accept the license, do not use the software and do not read its source code.

1. Definitions
The terms "reproduce," "reproduction" and "distribution" have the same meaning here as under U.S. copyright law.
"You" means the licensee of the software and its source code.

2. Grant of Rights
Copyright Grant - Subject to the terms of this license, the Licensor grants you a non-transferable, non-exclusive, worldwide, royalty-free copyright license to use the software and read its source code.

3. Limitations
(A) No Trademark License - This license does not grant you any rights to use the Licensor's name, logo, or trademarks.
(B) If you begin any litigation against the Licensor over patents or technologies that you think may apply to the software (including a cross-claim or counterclaim in a lawsuit), your license to the software and its source code ends automatically.
(C) You cannot reproduce or make duplicates of software in any commercial projects. Creating similar commercial projects with 30% or more similarity of source code automatically ends your license to the software and its source code and will lead to legal actions.
(D) The software is licensed "as-is." You bear the risk of using it. The Licensor gives no express warranties, guarantees or conditions. You may have additional consumer rights under your local laws which this license cannot change. To the extent permitted under your local laws, the Licensor excludes the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
