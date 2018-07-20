.. index:: ! moderation-appendix
.. _moderation-appendix:


###################
Moderation Appendix
###################

Functions
~~~~~~~~~

================    ====================================================
ID                  Mf1
================    ====================================================
Name                ``extendModerationWindow``

Description         | Internal function for extending the moderation window after the completion of another
                    | phase to the moderation process. This occcurs after challenge deposit has been met or
                    | after affirm deposit has been met.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- response targeted for or by moderation phase
                    | ``uint256`` **_type** -- challenge type ID

Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf2
================    ====================================================
Name                ``challenge``

Description         | Initailizes a challenge either for or against a response. If the challenge is for a
                    | response, the sender is indicating that the reponse satisfies the query and the bounty
                    | staked to the query should be deposited to the creator of the response. If the
                    | challenge is aginst the response, the sender is indicating that this response is
                    | malicious or invalid and should therefore be blocked from retrieving disbursements.
                    | The challenge action is confirmed once the collective deposits for a challenge reach
                    | either 1/100 of the total amount staked or disbursed. The confirmation of a challenge
                    | invalidates the oppsoing party until it is confirmed for affirmation.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query targeted for challenge, or query of response targeted
                    | ``bytes32`` **_rHash** -- response targeted for or by challenge
                    | ``uint256`` **_deposit** -- amount being deposited to meet challenge deposit need
                    | ``uint256`` **_type** -- challenge type ID

Requirements        - Response must have be a response to the query in question
                    - Response must not have already been challenged by this type
                    - Sender balance must not exceed amount depositing for challenge
                    - Challenge deposit addition must not exceed total necessary to confirm challenge
                    - Response must be initailized, from **Ms1**
                    - Type must be a valid challenge type, from **Ms2**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf3
================    ====================================================
Name                ``challengeDepositNeeded``

Description         | Returns the necessary amount of additional deposits needed to confirm a challenge.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query hash for type 1 staking
                    | ``bytes32`` **_rHash** -- response hash for non-type 1 staking
                    | ``uint256`` **_type** -- challenge type ID


Requirements        *None*

Returns             ``uint256`` necessary deposit amount
================    ====================================================



================    ====================================================
ID                  Mf4
================    ====================================================
Name                ``affirm``

Description         | Initailizes an affirm after a response has been challenged. If the challenge was
                    | against the response, the affirming sender is inidicating that the response remains
                    | valid and should therefore be able to retrieve disbursements. If the challenge was
                    | for the response, the sender is indicating that the response does not satisfy the
                    | query and should therefore not recieve the query's staked bounty amount.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged response
                    | ``uint256`` **_deposit** -- amount being deposited to meet affirm deposit needs
                    | ``uint256`` **_type** -- challenge type ID


Requirements        - Response must have been confirmed for challenge
                    - Sender balance must not exceed amount depositing for affirming
                    - Affirm deposit addition must not exceed total necessary to confirm affirm
                    - Response must be initailized, from **Ms1**
                    - Moderation window must not have closed for response, from **Ms4**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf5
================    ====================================================
Name                ``affirmDepositNeeded``

Description         | Returns the necessary amount of additional deposits needed to confirm an affirm.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged response hash
                    | ``uint256`` **_type** -- challenge type ID


Requirements        *None*

Returns             ``uint256`` necessary deposit amount
================    ====================================================



================    ====================================================
ID                  Mf6
================    ====================================================
Name                ``moderateObject``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf7
================    ====================================================
Name                ``retrieveModerationDeposit``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf8
================    ====================================================
Name                ``collectModerationPayment``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf9
================    ====================================================
Name                ``activateModerator``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================



================    ====================================================
ID                  MfA
================    ====================================================
Name                ``deactivateModerator``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================




Structures
~~~~~~~~~~


================    ====================================================
ID                  Ms1
================    ====================================================
Name                ``initialized``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the content (query or response) has been
                    | initialized by check that the owner value is non-zero.

Type                ``modifier``
================    ====================================================


================    ====================================================
ID                  Ms2
================    ====================================================
Name                ``validChallengeType``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the challenge being initailized is a pre-approved
                    | form of challenge. Currently this includes challenging the validity of an outstanding
                    | bounty (type 1) or challenging the validity of a recently disbursed bounty , being
                    | type 2 or 3.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ms3
================    ====================================================
Name                ``isModerator``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the sender of the function is a moderator of the
                    | community of the content in question. This is used when moderating an object.

Type                ``function``
================    ====================================================



================    ====================================================
ID                  Ms4
================    ====================================================
Name                ``inModerationWindow``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the object in questions is currently within the
                    | given moderation window. This is used to is check that the moderation window hasn't
                    | expired prior to calling the next step in moderation for affirming and moderating
                    | objects.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ms5
================    ====================================================
Name                ``outModerationWindow``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the object in question is outside the given
                    | moderation window. This is used to is check that the moderation window has concluded
                    | prior to retrieving deposits or collecting payment.


Type                ``modifier``
================    ====================================================
