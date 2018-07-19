.. index:: ! content-appendix
.. _content-appendix:


################
Content Appendix
################

Functions
~~~~~~~~~

================    ====================================================
ID                  Cf1
================    ====================================================
Name                ``createQuery``

Description         | Creation function for initializing a query. This sets the sender as the owner and
                    | initialized the communtiy and type of the query.


Contract            ``Content.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- Swarm hash of query content
                    | ``string`` **_community** -- community targeted for the query, used for moderation
                    | ``uint256`` **_type** -- query type ID (open, pointed, distributed)


Requirements        - The query hash must be uninitialzied, from **Cs2**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf2
================    ====================================================
Name                ``createResponse``

Description         | Creation function for initializing a response to a query. This sets the sender as the
                    | owner and initialized the response as that of the query.


Contract            ``Content.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- Swarm hash of query content
                    | ``bytes32`` **_rHash** -- Swarm hash of response content


Requirements        - The query hash must be initialzied, from **Cs1**
                    - The response hash must be uninitialzied, from **Cs2**
                    - The sender must be targeted if not open-type, **Cs3**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf3
================    ====================================================
Name                ``setTarget``

Description         | Initialization function for setting the responder target for non open-type queries.


Contract            ``Content.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- Swarm hash of query content
                    | ``address`` **_target** -- target for query response


Requirements        - The query hash must be initialzied, from **Cs1**
                    - Sender must be the owner of the query, from **Cs4**

Returns             *None*
================    ====================================================




Structures
~~~~~~~~~~

================    ====================================================
ID                  Cs1
================    ====================================================
Name                ``initialized``

Contract            ``Content.sol``

Description         | Modifier function for requiring that the content (query or response) has been
                    | initialized by check that the owner value is non-zero.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Cs2
================    ====================================================
Name                ``uninitialized``

Contract            ``Content.sol``

Description         | Modifier function for requiring that the content (query or response) has not been
                    | initialized by check that the owner value is zero.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Cs3
================    ====================================================
Name                ``validResponder``

Contract            ``Content.sol``

Description         | Modifier function for requiring that the sender of a function is the targeted responder.
                    | This is used by non type-1 queries (distributed or pointed).

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Cs4
================    ====================================================
Name                ``isOwner``

Contract            ``Content.sol``

Description         | Modifier function for requiring that the sender of a function is the owner of the
                    | content in question.

Type                ``modifier``
================    ====================================================
