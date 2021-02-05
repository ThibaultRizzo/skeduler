import abc
from functools import reduce


class MetaInterface(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        method_list = [
            func
            for func in dir(cls)
            if callable(getattr(cls, func)) and not func.startswith("__")
        ]
        print(method_list)
        result = True
        for method in method_list:
            result = hasattr(subclass, method) and callable(getattr(subclass, method))

        return result or NotImplemented


class IFixedAssignment(MetaInterface):
    @abc.abstractmethod
    def load_data_source(self, path: str, file_name: str):
        """Load in the data set"""
        raise NotImplementedError

    @abc.abstractmethod
    def extract_text(self, full_file_path: str):
        """Extract text from the data set"""
        raise NotImplementedError


# class FormalParserInterface(metaclass=abc.ABCMeta):
#     @classmethod
#     def __subclasshook__(cls, subclass):
#         method_list = [
#             func
#             for func in dir(cls)
#             if callable(getattr(cls, func)) and not func.startswith("__")
#         ]
#         print(method_list)
#         result = True
#         for method in method_list:
#             result = hasattr(subclass, method) and callable(getattr(subclass, method))

#         return result or NotImplemented

# @abc.abstractmethod
# def load_data_source(self, path: str, file_name: str):
#     """Load in the data set"""
#     raise NotImplementedError

# @abc.abstractmethod
# def extract_text(self, full_file_path: str):
#     """Extract text from the data set"""
#     raise NotImplementedError


class PdfParserNew(IFixedAssignment):
    """Extract text from a PDF."""

    def load_data_source(self, path: str, file_name: str) -> str:
        """Overrides FormalParserInterface.load_data_source()"""
        pass

    def extract_text(self, full_file_path: str) -> dict:
        """Overrides FormalParserInterface.extract_text()"""
        pass


class EmlParserNew(IFixedAssignment):
    """Extract text from an email."""

    def load_data_source(self, path: str, file_name: str) -> str:
        """Overrides FormalParserInterface.load_data_source()"""
        pass

    def extract_text_eeee(self, full_file_path: str) -> dict:
        """A method defined only in EmlParser.
        Does not override FormalParserInterface.extract_text()
        """
        pass
