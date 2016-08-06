{-# LANGUAGE ForeignFunctionInterface #-}

-- File.chs

-- hgeometric: A geometric library with bindings to GPC.
-- File.chs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- Copyright 2007, 2009 Rafael Cunha de Almeida

-- See LICENSE

-- | Support for reading and writing a 'Polygon' in a file.
module Algebra.Geometric.Polygon.File (readPolygon, writePolygon) where

#include <stdio.h>
#include "gpc.h"

import Foreign
import Foreign.C

import Algebra.Geometric.Polygon

{#context prefix = "gpc"#}

{#pointer *polygon as CPolygon -> Polygon#}

-- | Reads a file into a 'Polygon'. If the file isn't accessible, then
-- 'Nothing' is returned.
readPolygon :: FilePath -> Bool -> IO (Maybe Polygon)
readPolygon fileName hole =
    alloca $
    \cResult ->
    do
    cFileName <- newCString fileName
    mode <- newCString "r"

    file <- {#call unsafe fopen#} cFileName mode

    let free_ = free cFileName >> free mode

    if file == nullPtr
        then free_ >> return Nothing
        else
        do
        {#call unsafe read_polygon#} file (fromBool hole) cResult
        {#call unsafe fclose#} file

        result <- peek cResult

        free_
        {#call unsafe free_polygon#} cResult

        return $ Just result

-- | If the 'Polygon' was successfully written, then this function returns
-- 'True', and 'False' otherwise.
writePolygon :: String -> Bool -> Polygon -> IO Bool
writePolygon fileName hole polygon =
    alloca $
    \cPolygon ->
    do
    poke cPolygon polygon

    cFileName <- newCString fileName
    mode <- newCString "w"

    file <- {#call unsafe fopen#} cFileName mode

    let free_ = free cFileName >> free mode

    if file == nullPtr
        then free_ >> return False
        else
        {#call unsafe write_polygon#} file (fromBool hole) cPolygon >>
        {#call unsafe fclose#} file >>

        free_ >> {#call unsafe free_polygon#} cPolygon >>

        return True
